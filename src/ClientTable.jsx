import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import Modal from "react-modal";
import Client from "./Client.ts";

const API_SERVER_URL = 'http://localhost:8080/clients';
const REGISTER_FAIL = '登録に失敗しました。';

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [inputFamilyname, setInputFamilyname] = useState(null);
  const [inputFirstname, setInputFirstname] = useState(null);
  const [inputAddress, setInputAddress] = useState(null);
  const [registerResult, setRegisterResult] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTargets, setEditTargets] = useState([]);
  const [editResult, setEditResult] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState([]);

  useEffect(() => {
    axios.get(API_SERVER_URL).then((response) => {
      let ret = [];
      response.data.forEach((element) => {
        ret.push(new Client(
          element.id,
          element.familyname,
          element.firstname,
          element.address,
          element.createdAt
        ));
      });
      setClients(ret);
    });
  }, []);

  /**
   * 登録
   */
  function register() {
    axios.post(API_SERVER_URL, {
        familyname: inputFamilyname,
        firstname: inputFirstname,
        address: inputAddress
    }).then((response) => {
        switch(response.status) {
            case 201:
                let clientsTmp = Array.from(clients);
                clientsTmp.push(new Client(
                  response.data.id,
                  response.data.familyname,
                  response.data.firstname,
                  response.data.address,
                  response.data.createdAt
                ));
                setClients(clientsTmp);
                setRegisterModalOpen(false);
                // clear();
                break;
            default:
                break;
        }
        return clients;
    }).catch((error) => {
        switch(error.response.status) {
            case 400:
                setRegisterResult(REGISTER_FAIL);
                break;
            default:
                break;
        }
    })
  }

  /**
   * 編集
   */
  function edit() {
    axios.post(API_SERVER_URL + '/bulk_update', editTargets)
    .then((response) => {
      switch(response.status) {
        case 200:
          // 返却された顧客リストを反映
          reflectClients(response.data);
          setEditModalOpen(false);
          clear();
          break;
        default:
          break;
      }
    }).catch((error) => {
      switch(error.response.status) {
        case 400:
          setEditResult('登録に失敗しました。');
          break;
        default:
          break;
      }
    });
  }

  /**
   * 削除
   */
  function deleteClients() {
    axios.post(API_SERVER_URL + '/delete', deleteTargets)
    .then((response) => {
      switch(response.status) {
        case 200:
          reflectDeleteResult();
          break;
        default:
          break;
      }
    }).catch((error) => {
      switch(error.response.status) {
        case 400:
          alert('削除に失敗しました。');
          break;
        default:
          break;
      }
    });

    setDeleteModalOpen(false);
  }

  function reflectDeleteResult() {
    let array = clients.filter((client) => {
      return !deleteTargets.includes(client.id);
    });
    
    setClients(array);
  }

  function reflectClients(list) {
    const clientsTmp = clients.map((client) => {
      list.forEach((element) => {
        if(client.id === element.id) {
          client.id = element.id;
          client.familyname = element.familyname;
          client.firstname = element.firstname;
          client.address = element.address;
          client.createdAt = element.createdAt;
        }
      });
      return client;
    });

    setClients(clientsTmp);
  }

  function closeRegisterModal() {
    setRegisterModalOpen(false);
    clear();
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    clear();
  }

  function clear() {
    setInputFamilyname(null);
    setInputFirstname(null);
    setInputAddress(null);
    setRegisterResult(null);
    setEditTargets([]);
    setEditResult(null);
  }

  function editCheckClick(client, checkedStatus) {
    let array = Array.from(editTargets);
    array.push(client);
    setEditTargets(array);

    // チェック有効の設定
    setClients(
      clients.map((element) => {
        if(element.id === client.id) {
          element.isEditHidden = (checkedStatus === 'on') ? false : true;
        }
        return element;
      })
    );
  }

  function deleteCheckClick(id) {
    if(deleteTargets.includes(id)) {
      return;
    }

    let deleteTargetsTmp = Array.from(deleteTargets);
    deleteTargetsTmp.push(id);
    setDeleteTargets(deleteTargetsTmp);
  }

  function reflectFamilyname(id, familyname) {
    setEditTargets(
      editTargets.map((element) => {
        if(element.id === id) {
          element.familyname = familyname;
        }
  
        return element;
      })
    );
  }

  function reflectFirstname(id, firstname) {
    setEditTargets(
      editTargets.map((element) => {
        if(element.id === id) {
          element.firstname = firstname;
        }
  
        return element;
      })
    );
  }

  function reflectAddress(id, address) {
    setEditTargets(
      editTargets.map((element) => {
        if(element.id === id) {
          element.address = address;
        }
  
        return element;
      })
    );
  }

  function selectAllDeleteCheckbox() {
    let array = clients.map((client) => {
      return client.id;
    });
    setDeleteTargets(array);
  }

  return (
    <div>
      <p>顧客情報を表示します。</p>
      <button onClick={() => setRegisterModalOpen(true)}>登録</button>
      <button onClick={() => {
        setClients(clients.map((element) => {
          element.isEditHidden = true;
          return element;
        }));
        setEditModalOpen(true);
      }}>編集</button>
      <button onClick={() => setDeleteModalOpen(true)}>削除</button>
      <table border="1" className="client-tabel">
        <thead>
          <tr>
            <th>氏名</th>
            <th>住所</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, i) => {
            return (
              <tr key={i}>
                <td>{client.familyname + " " + client.firstname}</td>
                <td>{client.address}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal isOpen={registerModalOpen}>
        <p>顧客情報を入力してください。</p>
        <div>
            <label>姓　：</label>
            <input onChange={(event) => setInputFamilyname(event.target.value)}></input>
        </div>
        <div>
            <label>名　：</label>
            <input onChange={(event) => setInputFirstname(event.target.value)}></input>
        </div>
        <div>
            <label>住所：</label>
            <input onChange={(event) => setInputAddress(event.target.value)}></input>
        </div>

        <label className="error-message">{registerResult}</label>
        <br></br>
        <button onClick={register}>登録</button>
        <button onClick={closeRegisterModal}>キャンセル</button>
      </Modal>

      <Modal isOpen={editModalOpen}>
        <p>顧客情報を編集してください。</p>
        <button onClick={edit}>確定</button>
        <button onClick={() => {
          clear();
          setEditModalOpen(false);
        }}>キャンセル</button>
        <label className="error-message">{editResult}</label>
        <table border="1">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>姓</th>
              <th>名</th>
              <th>住所</th>
            </tr>
          </thead>
          <tbody>
            {JSON.parse(JSON.stringify(clients)).map((element, i) => {
              return (
                <tr key={i}>
                  <td><input type="checkbox" name={element.id} onClick={(event) => editCheckClick(element, event.target.value)} /></td>
                  <td><input disabled={element.isEditHidden} defaultValue={element.familyname} onChange={(event) => reflectFamilyname(element.id, event.target.value)} /></td>
                  <td><input disabled={element.isEditHidden} defaultValue={element.firstname} onChange={(event) => reflectFirstname(element.id, event.target.value)} /></td>
                  <td><input disabled={element.isEditHidden} defaultValue={element.address} onChange={(event) => reflectAddress(element.id, event.target.address)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>

      <Modal isOpen={deleteModalOpen}>
        <p>削除する顧客情報を選択してください。</p>
        <button onClick={deleteClients}>確定</button>
        <button onClick={closeDeleteModal}>キャンセル</button>
        <label className="error-message">{editResult}</label>
        <table border="1">
          <thead>
            <tr>
              <th><input type="checkbox" onClick={selectAllDeleteCheckbox} /></th>
              <th>姓</th>
              <th>名</th>
              <th>住所</th>
            </tr>
          </thead>
          <tbody>
            {JSON.parse(JSON.stringify(clients)).map((element, i) => {
              return (
                <tr key={i}>
                  <td><input type="checkbox" name={element.id} onClick={() => deleteCheckClick(element.id)} /></td>
                  <td>{element.familyname}</td>
                  <td>{element.firstname}</td>
                  <td>{element.address}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
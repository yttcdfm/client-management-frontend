import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import Modal from "react-modal";

const API_SERVER_URL = 'http://localhost:8080/clients';
const REGISTER_FAIL = '登録に失敗しました。';

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [inputFamilyname, setInputFamilyname] = useState(null);
  const [inputFirstname, setInputFirstname] = useState(null);
  const [inputAddress, setInputAddress] = useState(null);
  const [registerResult, setRegisterResult] = useState(null);

  useEffect(() => {
    axios.get(API_SERVER_URL).then((response) => {
      setClients(response.data);
    });
  }, []);

  function register() {
    console.log(inputFamilyname);
    console.log(inputFirstname);
    console.log(inputAddress);
    axios.post(API_SERVER_URL, {
        familyname: inputFamilyname,
        firstname: inputFirstname,
        address: inputAddress
    }).then((response) => {
        switch(response.status) {
            case 201:
                let array = Array.from(clients);
                array.push({
                    id: response.data.id,
                    familyname: response.data.familyname,
                    firstname: response.data.firstname,
                    address: response.data.address,
                    createdAt: response.data.createdAt
                });
                setClients(array);
                setRegisterModalOpen(false);
                clear();
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

  function closeRegisterModal() {
    setRegisterModalOpen(false);
    clear();
  }

  function clear() {
    setInputFamilyname(null);
    setInputFirstname(null);
    setInputAddress(null);
    setRegisterResult(null);
  }

  return (
    <div>
      <p>顧客情報を表示します。</p>
      <button onClick={() => setRegisterModalOpen(true)}>登録</button>
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
    </div>
  );
}
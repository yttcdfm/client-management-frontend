import axios from "axios";
import { useEffect, useState } from "react";

export default function ClientTable() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/clients').then((response) => {
                setClients(response.data);
            }
        );
    });

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>氏名</th>
                    <th>住所</th>
                </tr>
            </thead>
            <tbody>
                {
                    clients.map((client, i) => {
                        return (<tr key={i}>
                            <td>{client.familyname + ' ' + client.firstname}</td>
                            <td>{client.address}</td>
                        </tr>);
                    })
                }
            </tbody>
        </table>
    );
}
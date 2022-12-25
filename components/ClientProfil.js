import React from "react";
import Navbar from "./Navbar";
import style from "../styles/ClientProfil.module.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Modal } from "antd";
import Header from "./Header";
Header;

function ClientProfil() {
  const router = useRouter();
  console.log("log du query", router.query);
  // modal update client
  const [addDocModal, setaddDocModal] = useState(false);
  //modal succes qui s'ouvre si la route (update) est true
  const [successModifModal, setSuccesModifModal] = useState(false);
  // modal error qui s'ouvre si la route (update) est false
  const [errorModifModal, setErrorModifModal] = useState(false);
    //modal succes qui s'ouvre si la route (delete) est true
  const [successDeleteModal, setSuccesDeleteModal] = useState(false);
    // modal error qui s'ouvre si la route (delete) est false
  const [errorDeleteModal, setErrorDeleteModal] = useState(false);
  const [dataInterlocutor, setDataInterlocutor] = useState([]); // ?
  // les set détat pour récuperer les valeurs de l'input et les mettre à jour
  const [name, setname] = useState("");
  const [clientBirth, setclientBirth] = useState("");
  const [address, setaddress] = useState("");
  const [numberOfEmployees, setnumberOfEmployees] = useState("");
  const [chiffre, setchiffre] = useState("");
  const [interlocutor, setinterlocutor] = useState("");
  const [contrat, setContrat] = useState("");
  const backend_adress = "http://localhost:3000";

  const clientBirthDate = new Date(clientBirth); // à demander
  const clientBirthDateFormated = clientBirthDate.toLocaleDateString(); // méthod qui convertie les dates en string convertir 

  const idClient = useSelector((state) => state.client.value);

  useEffect(() => {
    fetch(`${backend_adress}/client/id/${idClient._id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("le data contrat", data.client.contrats);
        if (data.result) {
          console.log("dataaaaaaaa", data);
          setname(data.client.name);
          setaddress(data.client.address);
          setnumberOfEmployees(data.client.numberOfEmployees);
          setclientBirth(data.client.clientBirth);
          setchiffre(data.client.chiffre);
          // au chargement je récupère mon tableau populate , je fait un sorte que que si c'est pas un tableau
          // ça le devient
          if (!Array.isArray(data.client.interlocutor)) {
            setinterlocutor([]);
          } else {
            setinterlocutor(data.client.interlocutor);
          }
          // au chargement je récupère mon tableau populate , je fait un sorte que que si c'est pas un tableau
          // ça le devient
          if (!Array.isArray(data.client.contrats)) {
            setContrat([]);
          } else {
            setContrat(data.client.contrats);
          }
        }
      });
  }, []);
// handleSubmit quand tu click sur modifier dans la modale ça prend les valeurs des champs de saisie du input et j'envoie 
// dans mon backend ces valeurs et je les modifie grace à la méthod put 
  const handleSubmit = () => {
    fetch(`${backend_adress}/client/update/${idClient._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        address: address,
        numberOfEmployees: numberOfEmployees,
        clientBirth: clientBirth,
        chiffre: chiffre,
        interlocutor: interlocutor,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
// si ça a bien modifier alors set mes valeurs et met les à jour avec les nouvelles data de la bdd 
//et set les champs de saisie pour l'affichage des valeurs en front
        if (data.result) {
          setname(data.client.name);
          setaddress(data.client.address);
          setnumberOfEmployees(data.client.numberOfEmployees);
          setclientBirth(data.client.clientBirth);
          setchiffre(data.client.chiffre);
          // if (!Array.isArray(data.client.interlocutor)) {
          //   setinterlocutor([]); //à demander ??
          // } else {
          //   setinterlocutor(data.client.interlocutor);
          // }
          setSuccesModifModal(true);
        } else {
          setErrorModifModal(false);
        }
      });
  };
// je cherche par apport à l id que je recupere du reducer et je delete
  const SupprimClient = () => {
    fetch(`${backend_adress}/client/delete/${idClient._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setSuccesDeleteModal(true);
        } else {
          console.log("echec");
          setErrorDeleteModal(false);
        }
      });
  };
//fermer la modal update client
  const handleModal = () => {
    setaddDocModal(false);
  };
// cancel modal delete et push vers all client
  const handleDeleteModal = () => {
    setSuccesDeleteModal(false);
    router.push("/allClients");
  };
//fermeture de la modal succes et la modal update client
  const handleCloseModal = () => {
    setSuccesModifModal(false);
    setaddDocModal(false);
  };
  console.log("inter", interlocutor);
// je déclare ma variable je dis ma variable = au .map du mon tableau interlocutor que j'ai récuperer dans mon backend
// je verifie si mon tableau est true si il existe puis je map dans mon tableau d'interlocutor
// le firstname et le name et le numero de l'interlocutor 
// interlocutor position 0 + 1 grace à l'index
  let interlocutorData;
  console.log("Infos interlocuteur =>", interlocutor);
  if (interlocutor) {
    interlocutorData = interlocutor.map((data, i) => (
      <li key={i}>
        Interlocuteur {i + 1} : {data.firstname} {data.name}
      </li>
    ));
  }
  let contratData;

  if (contrat) {
    contratData = contrat.map((data, i) => (
      <li key={i}>
        Contrat {i + 1} : Nom: {data.name}{" "}
      </li>
    ));
  }

  return (
    <>
      <div className={style.mainContainer}>
        <Navbar styleAllClients={{ backgroundColor: "#2A9C90" }} />
        <Header name={name} />
        <div className={style.container}>
          <div className={style.GridParent}>
            <div className={style.GridContent}>
              <div className={style.Infosclient}>
                <h2>Informations client :</h2>
                <ul>
                  <li>Nom entreprise : {name} </li>
                  <li>Client depuis le : {clientBirthDateFormated} </li>
                  <li>Adresse : {address} </li>
                  <li>Nombre de salariés : {numberOfEmployees} </li>
                  <li>Chiffre d'affaires : {chiffre} </li>
                  {interlocutorData}
                </ul>
                <div className={style.buttoncontainer}>
                  <button
                    className={style.buttonModal}
                    onClick={() => setaddDocModal(true)}
                  >
                    Modifier
                  </button>
                  <button
                    className={style.buttonModal}
                    onClick={() => SupprimClient()}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <div className={style.docsContainer}>
                <h3>Documents joints : </h3>
                {contratData}
                <button
                  className={style.buttonModal}
                  onClick={() => handleCloseModal()} // ferme une modal qui sert à rien (succes et update)
                >
                  Ajouter un document
                </button>
              </div>
            </div>
            <div className={style.ButtonContainer}></div>
          </div>
        </div>
      </div>
      <Modal onCancel={() => handleModal()} open={addDocModal} footer={null}>
        <div>
          <div className="modal-modifier">
            <input
              type="text"
              placeholder="Nom entreprise"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="modal-modifier">
            <input
              type="text"
              placeholder="ancienneté"
              value={clientBirth}
              onChange={(e) => setclientBirth(e.target.value)}
            />
          </div>
          <div className="modal-modifier">
            <input
              type="text"
              placeholder="addresse"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
            />
          </div>
          <div className="modal-modifier">
            <input
              type="text"
              placeholder="nombre d'employés"
              value={numberOfEmployees}
              onChange={(e) => setnumberOfEmployees(e.target.value)}
            />
          </div>
          <div className="modal-modifier">
            <input
              type="text"
              placeholder="CA"
              value={chiffre}
              onChange={(e) => setchiffre(e.target.value)}
            />
          </div>
        </div>
        <div className={style.form}>
          <div>
            {/* <label
              htmlFor="filePicker"
              className={style.customFileUpload + " " + style.button}
            ></label> */}
            <br />
            <button
              className={style.buttonModif}
              onClick={() => handleSubmit()} //envoyer grace à méthod put au backend l'id et update les valeurs du client
            >
              Modifier
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        onCancel={() => handleCloseModal()}
        open={successModifModal}
        footer={null}
      >
        <p style={{ fontSize: 18, textAlign: "center" }}>
          ✅ client modifié ! ✅
        </p>
      </Modal>
      <Modal
        onCancel={() => handleCloseModal()}
        open={errorModifModal}
        footer={null}
      >
        <p style={{ fontSize: 18, textAlign: "center" }}>
          ❌ erreur client non modifié ! ❌
        </p>
      </Modal>
      <Modal
        onCancel={() => handleDeleteModal()}
        open={successDeleteModal}
        footer={null}
      >
        <p style={{ fontSize: 18, textAlign: "center" }}>
          ✅ client supprimé ! ✅
        </p>
      </Modal>
      <Modal
        onCancel={() => handleCloseModal()}
        open={errorDeleteModal}
        footer={null}
      >
        <p style={{ fontSize: 18, textAlign: "center" }}>
          ❌ erreur client non suprimé ! ❌
        </p>
      </Modal>
    </>
  );
}

export default ClientProfil;

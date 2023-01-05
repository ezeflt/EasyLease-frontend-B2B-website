/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import style from "../styles/NewScenario.module.css";
import styles from "../styles/Settings.module.css"
import { Modal } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { addId } from '../reducers/scenario';
import Header from './Header';
import { removeId } from "../reducers/scenario";
import {CategoryScale, LinearScale, ArcElement, PointElement, LineElement} from 'chart.js'; // est-ce que tu utilise chart js ?
import { Line } from 'react-chartjs-2'; //import de graphique en ligne de chart2
import { Chart } from 'chart.js';
Chart.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement); // pourquoi cette ligne ? les import sont au dessus

const dataGraphique = {
  labels: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
    "Janvier",
    "Février",
    "Mars",
  ],
  datasets: [
    {
      label: 'Valeur en euros',
      data: [100000, 85000, 72250, 61962.5, 53165.625, 45641.40625, 39312.203125, 33866.671875, 29148.9453125, 25079.21875, 21491.171875, 18368.5478515625, 10000, 5000, 0],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)', //border color de la ligne dynamique du graphique
      borderWidth: 1, // border ligne graphique dynamique
      pointBackgroundColor: '#fff', // background color de la boule qui à comme data les valeurs dynamique
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)', // background hover point dynamique
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)', // border color hover point dynamique
    },
    {
      label: "Ligne horizontale",
      data: [
        20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000,
        20000, 20000, 20000, 20000, 20000,
      ],
      borderColor: "green",
      borderWidth: 2,
      pointRadius: 0,
      fill: false, // ?
    },
  ],
};

// scale par default ??
const optionsGraphique = {
  responsive: true,
  maintainAspectRatio: false, // maintient le rapport hauteur/largeur du graphique & il est false comme ça il s'adapte pas à la taill des data mais à la taille du graphique défini en style
};





function NewScenario() {
  const dispatch = useDispatch();
  const router = useRouter();
  const date = new Date();

  const idScenario = useSelector((state) => state.scenario.value);
  const user = useSelector((state) => state.user.value); // faire passer les push en backend 

  // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

  let BACKEND_ADDRESS = "http://localhost:3000";
  const [selectionClient, setSelectionClient] = useState(""); // setter(string) value du select de selection client
  const [clientFromCard, setClientFromCard] = useState("") // setter(string) client récuperer grace à l'id au click de la carte
  const [creationDate, setCreationDate] = useState(date.toISOString().substring(0, 10)); // valeur création de date
  const [scenarioName, setScenarioName] = useState(""); // setter(string) valeur nom du scenario
  const [equipementType, setEquipementType] = useState(""); // setter(string) valeur select type d'équipement
  const [locationDuration, setLocationDuration] = useState(""); // setter(string) valeur select durée de location
  const [amountFinance, setAmountFinance] = useState(""); // setter(string) valeur montant financé
  const [startDateLocation, setStartDateLocation] = useState(""); // setter(string) valeur du début de location
  const [endDateLocation, setEndDateLocation] = useState(""); // setter(string) valeur de fin de location
  const [residualValue, setResidualValue] = useState(""); // setter(string) valeur de la valeur residuelle
  const [margeValue, setMargeValue] = useState(""); // setter(string) valeur de la marge

  const [oldScenario, setOldScenario] = useState(false); // setter (booléan) de old scenario pour changer le contenue de la page si le scenario est vieux

  const [modalSaveSuccess, setModalSaveSuccess] = useState(false); // setter (booléan) modal save scenario (result.true) ✅
  const [modalSaveFailed, setModalSaveFailed] = useState(false); // setter (booléan) modal save scenario (else POST) ❌

  const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false); // setter (booléan) modal delete (result.true) ✅
  const [modalDeleteFailed, setModalDeleteFailed] = useState(false); // setter (booléan) modale delete (esle DELETE) ❌

  const [modalModifierFailed, setModalModifierFailed] = useState(false); // setter (booléan) modale update (result.true) ✅
  const [modalModifierSuccess, setModalModifierSuccess] = useState(false); // setter (booléan) modale update (else PUT) ❌

  const [modalSubmitSuccess, setModalSubmitSuccess] = useState(false); // setter (booléan) modale Add Contrat (reslut.true) ✅
  const [modalSubmitFailed, setModalSubmitFailed] = useState(false); // setter (booléan) modale Add Contrat (else POST) ❌

  const [clientList, setClientList] = useState([]);// setter tableau pour récuperer le tableau de list de client et le map
  const [oneClient, setOneClient] = useState([]);// setter pour récuperer les infos du client et map les interlocutor
  const [selectionInterlocuteur, setSelectionInterlocuteur] = useState({}); // setter de la valeur du select dans la selection d'interlocutor
  const [selectClientById, setSelectClientById] = useState(""); // pourquoi ByID
  const [clientNameFromFetch, setClientNameFromFetch] = useState(""); // 
  const [deleteBtn, setDeleteBtn] = useState(false); // deleteBtn c'est quoi ?
  const [modalSaveInterloc, setModalSaveInterloc] = useState(false); // setter (booléan) modal save interlocuor
  const [interlocFilter, setInterlocFilter] = useState([]);
  const [modalInterlocError, setModalInterlocError] = useState(false);
  const [addInterlocutorModal, setAddInterlocutorModal] = useState(false);

  const [interlocName, setInterlocName] = useState(""); // setter (string) nom d'interlocutor /modal ajout interlocutor 
  const [phoneNumber, setPhoneNumer] = useState(""); // setter (string) Numero de tel d'interlocutor /modal ajout interlocutor 
  const [interlocFirstName, setInterlocFirstname] = useState(""); // setter (string) Prénom d'interlocutor /modal ajout interlocutor 
  const [interlocMail, setInterlocMail] = useState(""); // setter (string) Email d'interlocutor /modal ajout interlocutor 
  const [interlocJob, setInterlocJob] = useState(""); // setter (string) job d'interlocutor /modal ajout interlocutor 

  const [addInterlocutorSucccess, setAddInterlocutorSuccess] = useState(false); // setter (booléan) modal POST interlocutor (reslut.true) ✅
  const [addInterlocutorFailed, setAddInterlocutorFailed] = useState(false); // setter (booléan) modal POST interlocutor (else POST) ❌

  const [handleBeforeDeleteModal, setHandleBeforeDeleteModal] = useState(false);

  // console.log(idScenario)
  // Check si le scenario est déja enregistrer en BDD//

  useEffect(() => {
    if (selectionClient) {
      fetch(`${BACKEND_ADDRESS}/client/${selectionClient}`) // recupere nom du client
      .then(response => response.json())
      .then(data => {
        setOneClient([data.client]) // toute les infos du client
        setSelectClientById(data.client._id); // juste l'id du client à demander
        setClientNameFromFetch(data.client.name); // récuperer le nom du client pour l'affichage
        setInterlocFilter([])
      })
    }
   }, [selectionClient, deleteBtn]); // pourquoi delete Btn

  // console.log("ONE CLIENT =>", oneClient);

  useEffect(() => {
    if (!idScenario._id) {
      fetch(`${BACKEND_ADDRESS}/client/test/${user.token}`)
      .then(response => response.json())
      .then(data => {
        //console.log("Liste des clients", data.clients);
        setClientList(data.clientsInfos.clients) // si tu trouve pas l'id set la liste des data pour menu déroulant
      })
    }
    if (idScenario._id) {
      fetch(`${BACKEND_ADDRESS}/scenary/${idScenario._id}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("DATA SCENARIO !!!!!!!!!!!", data);
          if (data.result){
            // console.log(data);
            setOldScenario(data.result);
            fetch(`${BACKEND_ADDRESS}/client/id/${data.scenary.client}`) // l'id du client
            .then(response => response.json())
            .then(data => {
              // console.log("DATA 2 EME FETCH", data);
             setClientFromCard(data.client.name); // recup le nom
             setOneClient([data.client]) // recup toute les infos d'un client
            })
            setSelectClientById(data.scenary.client)
            setCreationDate(data.scenary.creationDate.slice(0, 10));
            setScenarioName(data.scenary.name);
            setEquipementType(data.scenary.type);
            setLocationDuration(data.scenary.duration);
            setAmountFinance(data.scenary.amount);
            setStartDateLocation(data.scenary.contratStart.slice(0, 10));
            setEndDateLocation(data.scenary.contratEnd.slice(0, 10));
            setResidualValue(data.scenary.residualValue);
            setMargeValue(data.scenary.marge);
          }
        });
    }
  }, [deleteBtn]); // delete button c'est quoi ??


  // console.log("ID SCENARIO.ID" , idScenario._id);
  // console.log("START DATE =>", startDateLocation);
  // console.log("CLIENT SELECTION =>", selectionClient);
  // console.log("CLIENT LIST", clientList);

  const modification = () => {
    // console.log("Click modification");
    fetch(`${BACKEND_ADDRESS}/scenary/update/${idScenario._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: selectClientById,
        name: scenarioName,
        type: equipementType,
        duration: locationDuration,
        amount: amountFinance,
        creationDate: creationDate,
        contratStart: startDateLocation,
        contratEnd: endDateLocation,
        residualValue: residualValue,
        links: "TEST",
        marge: margeValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setModalModifierSuccess(true);
        } else {
          // console.log("DATA PUT=>", data);
          setModalModifierFailed(true);
        }
      });
  };

  const deletion = () => {
    // console.log("Click delete");
    fetch(`${BACKEND_ADDRESS}/scenary/${idScenario._id}`, { // comment tu récupere l'id de ton scenario à l'enregistrement ??
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setHandleBeforeDeleteModal(false)
          setModalDeleteSuccess(true);
          setOldScenario(false);
          setCreationDate(date.toISOString().substring(0, 10));
          setScenarioName("");
          setEquipementType("");
          setLocationDuration("");
          setAmountFinance("");
          setStartDateLocation("");
          setEndDateLocation("");
          setResidualValue("");
          setMargeValue("");
        } else {
          setModalDeleteFailed(true);
        }
        // console.log(data);
      });
  };

  const save = () => {
    // console.log("Click enregistrer");
    fetch(`${BACKEND_ADDRESS}/scenary/new/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: selectClientById,
        name: scenarioName,
        type: equipementType,
        duration: locationDuration,
        amount: amountFinance,
        creationDate: creationDate,
        contratStart: startDateLocation,
        contratEnd: endDateLocation,
        residualValue: residualValue,
        links: "TEST",
        marge: margeValue,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addId(data.infosScenario));
          setModalSaveSuccess(true);
          setOldScenario(true);
          setSelectionClient("");
        } else {
          // console.log("DATA =>", data);
          setModalSaveFailed(true);
        }
      });
  };

  // console.log("ID SCENARIO FROM NEW SCENARIO", idScenario);
  // console.log("SELECT CLIENT BY ID", selectClientById);
  // console.log("SCENARIO NAME +>>>>>>>>>>>>>", scenarioName);
  // console.log("SELECTION INTERLOC", selectionInterlocuteur);

  const beforeSubmit = () => { // button valider le scenario en contrat (ouvre modal avant la validation)
    setModalSaveInterloc(true);
  };

  const submit = () => {
    if (interlocFilter) {
      if (interlocFilter.length <= 0) {
        setModalInterlocError(true);
        return;
      }
    }
    fetch(`${BACKEND_ADDRESS}/contrat/addContrat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: selectClientById,
        name: scenarioName,
        interlocutor: interlocFilter[0]._id,
        type: equipementType,
        duration: locationDuration,
        amount: amountFinance,
        creationDate: creationDate,
        contratStart: startDateLocation,
        contratEnd: endDateLocation,
        residualValue: residualValue,
        links: "TEST",
        marge: margeValue,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        if (data.result) {
          setModalSaveInterloc(false);
          setModalSubmitSuccess(true);
          setOldScenario(false);
          setSelectionClient("");
          setCreationDate(date.toISOString().substring(0, 10));
          setScenarioName("");
          setEquipementType("");
          setLocationDuration("");
          setAmountFinance("");
          setStartDateLocation("");
          setEndDateLocation("");
          setResidualValue("");
          setMargeValue("");
          //   setTimeout(function(){
          //     router.push('/scenario')
          // },1000);
          if (idScenario._id) {
            fetch(`${BACKEND_ADDRESS}/scenary/${idScenario._id}`, {
              method: "DELETE",
            });
          }
        } else {
          // console.log("DATA ERROR ???", data);
          setModalSubmitFailed(true);
        }
      });
  };

  const cancelModal = () => { // fermer toute les modals
    setModalSaveSuccess(false);
    setModalSaveFailed(false);
    setModalDeleteFailed(false);
    setModalModifierFailed(false);
    setModalModifierSuccess(false);
    setModalSubmitFailed(false);
    setModalSaveInterloc(false);
  };

  const handleOkContrat = () => { // apres avoir validé le scenario en contrat 
    setModalSubmitSuccess(false); // je ferme la modal
    router.push('/allContrat') // je suis redirigé sur all Contrat
  };

  const handleSaveScenario = () => { // fermer la modal succes
    setModalSaveSuccess(false);
  };

  const handleDeleteOk = () => { // close modale succes delete quand le scenario est bien supprimer
      setModalDeleteSuccess(false);
      setDeleteBtn(!deleteBtn);// pourquoi delete btn
      dispatch(removeId())
  }

  const returnScenario = () => {
    router.push('/allScenario')
  };


  let header;
  if (oldScenario) {
    header = `Nom du scénario : ${scenarioName}`;
  } else {
    header = "Nouveau Scénario";
  }
  // console.log("SECNARIO NAME", scenarioName);
  let clientsListDeroulante;
  if (clientList) {
    clientsListDeroulante = clientList.map((data, i) => {
      return <option key={i}>{data.name}</option>;
    });
  }

  let interlocutorListDeroulante;

  if (oneClient) {
    for (let clients of oneClient) {
      // console.log("ONE CLIENT FOR", clients.interlocutor);
      interlocutorListDeroulante = clients.interlocutor.map((data, i) => {
        return <option key={i}>{data.name}</option>;
      });
    }
  }

  const handleCancelModalInterloc = () => { // modal choisir un interlocutor avant de valider en contrat 
    setSelectionInterlocuteur("");
    setModalSaveInterloc(false);
  }
  useEffect(() => {
    setInterlocFilter(
      oneClient[0]
        ? oneClient[0].interlocutor.filter(
            (e) => e.name === selectionInterlocuteur
          )
        : null
    );
  }, [selectionInterlocuteur]);

  //   console.log("INTERLOC FILTER =>", interlocFilter);

  // console.log("creation date", creationDate);
  // console.log("Client selectionné =>", selectionClient);

  const addInterlocutor = () => { // modale creation d interlocutor
    setModalSaveInterloc(false);
    setAddInterlocutorModal(true);
  };

  const interlocutorModal = () => { // cancel modale creation d'interlocutor
    setAddInterlocutorModal(false);
    setModalSaveInterloc(true);
  };

  const saveInterlocuteur = () => {
    fetch(`${BACKEND_ADDRESS}/client/addInterlocutor`, { // on crée un interlocutor qui sera directement push à un client grace à son id et il sera automatiquement disponible
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: selectClientById,
        name: interlocName,
        firstname: interlocFirstName,
        phone: phoneNumber,
        poste: interlocJob,
        email: interlocMail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setDeleteBtn(!deleteBtn);
          setAddInterlocutorSuccess(true);
          setAddInterlocutorModal(false);
        } else {
          setAddInterlocutorFailed(true);
        }
      });
  };

  // console.log("ID SCENARIO", idScenario._id);

  const closeModalInterlocuteurSuccess = () => {
    setModalSaveInterloc(true);
    setAddInterlocutorSuccess(false);
  };

  const closeModalInterlocuteurFailed = () => {
    setModalSaveInterloc(true);
    setAddInterlocutorFailed(false);
  };

  const beforeDeletion = () => {
    setHandleBeforeDeleteModal(true);
  }

  return (
    <>
      <div className={style.mainContainer}>
        <Navbar styleScenario={{ backgroundColor: "#2A9C90" }} />
        <Header name={header} />
        <div className={style.container}>
          <div className={style.leftSection}> 
           {oldScenario && <p className={style.nomClient}>Nom du client : {clientNameFromFetch !== "" ? `${clientNameFromFetch}` :`${clientFromCard}`}</p>}
          {!oldScenario && <select
              className={style.input}
              onChange={(e) => setSelectionClient(e.target.value)}
              value={selectionClient}
              defaultValue
            >
              <option value="" disabled selected hidden>Choisisez un client</option>
              {clientsListDeroulante}
            </select>}
            <p className={style.para}>Date de création :</p>
            <input
              className={style.input}
              type="date"
              onChange={(e) => setCreationDate(e.target.value)}
              value={creationDate}
            />
            <p className={style.para}>Nom du scénario :</p>
            <input
              type="text"
              className={style.input}
              onChange={(e) => setScenarioName(e.target.value)}
              value={scenarioName}
              placeholder="Nom du scénario"
            />
            <p className={style.para}>Type d'équipement :</p>
            <select
              className={style.input}
              onChange={(e) => setEquipementType(e.target.value)}
              value={equipementType}
            >
              <option value="" disabled selected hidden>
                Choisisez un equipement
              </option>
              <option>Luminaires</option>
              <option>Informatique</option>
              <option>Automobile</option>
            </select>
            <p className={style.para + " " + style.trois}>Durée (mois) :</p>
            <select
              className={style.input}
              onChange={(e) => setLocationDuration(e.target.value)}
              value={locationDuration}
            >
              <option value="" disabled selected hidden>
                Choisisez une durée de location
              </option>
              <option>12</option>
              <option>24</option>
              <option>36</option>
              <option>48</option>
              <option>60</option>
              <option>72</option>
              <option>84</option>
              <option>96</option>
            </select>
            <p className={style.para}>Montant financé (€) :</p>
            <input
              type="text"
              className={style.input}
              onChange={(e) => setAmountFinance(e.target.value)}
              value={amountFinance}
              placeholder="Montant financé (€)"
            />
            <p className={style.para}>Marge (%) :</p>
            <input
              type="text"
              className={style.input}
              onChange={(e) => setMargeValue(e.target.value)}
              value={margeValue}
              placeholder="Marge (%)"
            />
            <p className={style.para + " " + style.un}>Date de début :</p>
            <input
              className={style.input}
              type="date"
              onChange={(e) => setStartDateLocation(e.target.value)}
              value={startDateLocation}
            />
            <p className={style.para + " " + style.de}>Date de fin :</p>
            <input
              className={style.input}
              type="date"
              onChange={(e) => setEndDateLocation(e.target.value)}
              value={endDateLocation}
            />
            <p className={style.para}>Valeur résiduelle :</p>
            <select
              className={style.input}
              onChange={(e) => setResidualValue(e.target.value)}
              value={residualValue}
            >
              <option value="" disabled selected hidden>
                Choisisez une valeur résiduelle
              </option>
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
              <option>25</option>
              <option>30</option>
            </select>
          </div>
          <div className={style.rightSection}>
            <div className={style.buttonsTop}>
              {oldScenario && (
                <button className={style.button} onClick={() => modification()}>
                  Modifier
                </button>
              )}
              {oldScenario && (
                <button className={style.button} onClick={() => beforeDeletion()}>
                  Supprimer
                </button>
              )}
              {!oldScenario && (
                <button className={style.button} onClick={() => save()}>
                  Enregistrer
                </button>
              )}
            </div>
            <div className={style.graphic}>
              {dataGraphique && (
                <Line data={dataGraphique} options={optionsGraphique} />
              )}
            </div>
            <div className={style.buttonBottom}>
              <button
                className={style.button + " " + style.bottomBtn}
                onClick={() => beforeSubmit()}
              >
                Valider ce scénario en contrat
              </button>
            </div>
          </div>
          <Modal
            onCancel={() => handleSaveScenario()}
            open={modalSaveSuccess}
            footer={null}
            className={style.modalSuccess}
          >
            <p
              style={{ fontSize: 22, textAlign: "center" }}
              className={style.modalSave}
            >
              ✅ Scenario eneregistré ! ✅
            </p>
            <div className={style.divSaveBtnModal}>
              <button
                className={style.button + " " + style.scenarioBtnModal}
                onClick={() => returnScenario()}
              >
                Retourner sur la page scenarios
              </button>
            </div>
          </Modal>
          <Modal
            onCancel={() => handleCancelModalInterloc()}
            open={modalSaveInterloc}
            footer={null}
            className={style.modalSuccess}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              Merci de choisir un interlocuteur pour ce scénario :
            </p>
            <select
              className={style.input + " " + style.inputModalInterlocuteur}
              onChange={(e) => setSelectionInterlocuteur(e.target.value)}
              value={selectionInterlocuteur}
              defaultValue
            >
              <option value="" selected hidden>
                Choisisez un interlocuteur
              </option>
              {interlocutorListDeroulante}
            </select>
            <p
              style={{ fontSize: 17, textAlign: "center" }}
              className={style.interlocModal}
            >
              L'interlocuteur n'est pas dans la liste ?{" "}
            </p>
            <div className={style.divSaveBtnModal}>
              <button
                className={style.button + " " + style.scenarioBtnModal}
                onClick={() => addInterlocutor()}
              >
                Ajout interlocuteur
              </button>
              <button
                className={style.button + " " + style.scenarioBtnModal}
                onClick={() => submit()}
              >
                Valider le scenario !
              </button>
            </div>
          </Modal>
          <Modal
            onCancel={() => interlocutorModal(false)}
            open={addInterlocutorModal}
            footer={null}
          >
            <div className={style.modalInterContainer}>
              <span className={style.textInterModal}>
                Nouvel Interlocuteur contrat :{" "}
              </span>
              <br />
              <div className={style.InputNewInterlocutorContainer}>
                <input
                  className={style.input + " " + style.inputInterloc}
                  placeholder="Nom"
                  type="text"
                  onChange={(e) => setInterlocName(e.target.value)}
                  value={interlocName}
                ></input>
                <br />
                <input
                  className={style.input + " " + style.inputInterloc}
                  placeholder="Prénom"
                  type="text"
                  onChange={(e) => setInterlocFirstname(e.target.value)}
                  value={interlocFirstName}
                ></input>
                <br />
                <input
                  className={style.input + " " + style.inputInterloc}
                  placeholder="Poste"
                  type="text"
                  onChange={(e) => setInterlocJob(e.target.value)}
                  value={interlocJob}
                ></input>
                <br />
                <input
                  className={style.input + " " + style.inputInterloc}
                  placeholder="Numéro de téléphone"
                  type="text"
                  onChange={(e) => setPhoneNumer(e.target.value)}
                  value={phoneNumber}
                ></input>
                <br />
                <input
                  className={style.input + " " + style.inputInterloc}
                  placeholder="Email"
                  type="text"
                  onChange={(e) => setInterlocMail(e.target.value)}
                  value={interlocMail}
                ></input>
                <br />
                <div>
                  <button
                    className={style.button + " " + style.btnInterModal}
                    onClick={() => saveInterlocuteur()}
                  >
                    {/* j'enregistre mon interlocutor en Bdd */}
                    Enregistrer 
                  </button> 
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            onCancel={() => cancelModal()}
            open={modalSaveFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Merci de remplir tous les champs ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => handleDeleteOk()}
            open={modalDeleteSuccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Scenario supprimé ! ✅
            </p>
          </Modal>
          <Modal
            onCancel={() => cancelModal()}
            open={modalDeleteFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Scenario non supprimé ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => cancelModal()}
            open={modalModifierSuccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Scenario modifié ! ✅
            </p>
          </Modal>
          <Modal
            onCancel={() => cancelModal()}
            open={modalModifierFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Scenario non modifié ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => handleOkContrat()}
            open={modalSubmitSuccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Scenario validé et transformé en contrat ! ✅
            </p>
          </Modal>
          <Modal
            onCancel={() => cancelModal()}
            open={modalSubmitFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Echec de la transformation en contrat ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => setModalInterlocError(false)}
            open={modalInterlocError}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ Vous n'avez pas choisi d'interlocuteur ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => closeModalInterlocuteurFailed(false)}
            open={addInterlocutorFailed}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ❌ L'ajout à échoué ! ❌
            </p>
          </Modal>
          <Modal
            onCancel={() => closeModalInterlocuteurSuccess()}
            open={addInterlocutorSucccess}
            footer={null}
          >
            <p style={{ fontSize: 18, textAlign: "center" }}>
              ✅ Interlocuteur ajouté ! ✅
            </p>
          </Modal>
          <Modal footer={null} open={handleBeforeDeleteModal} onCancel={() => setHandleBeforeDeleteModal(false)}>
                <div className={styles.modalContainer}>
                  <span className={styles.paragraphe}>Etes vous sur de vouloir supprimer ce scénario ?</span>
                  <div className={styles.buttonsConfirmation}>
                  <button
                    className={styles.button + " " + styles.deleteAccount}
                    onClick={() => deletion()}
                  >
                    Oui
                  </button>
                  <button
                    className={styles.button + " " + styles.right}
                    onClick={() => setHandleBeforeDeleteModal(false)}
                  >
                    Non
                  </button>
                  </div>
                </div>
              </Modal>
        </div>
      </div>
    </>
  );
}

export default NewScenario;

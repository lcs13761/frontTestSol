import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { ArticleAlignCenterLeft } from './Components/MainComponents';
import { Redirect } from 'react-router-dom';
import url from '../config';

function Simulated() {

  const [type, setType] = useState('simulated');
  const cookies = new Cookies();
  const [inputs, setInputs] = useState({});
  const [economia, setEconomia] = useState({});
  const [potencial, setPotencial] = useState({});
  const [parcelamento, setParcelamento] = useState([]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    document.querySelector(".load").style.display = "flex";
    return simulatedUser();
  }

  if (!cookies.get("user")) {
    return <Redirect from="*" to="/" />
  }

  async function simulatedUser() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('token')
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(url + '/simulated', requestOptions);
    let responseBody = await response.json();
    document.querySelector(".load").style.display = "none";
    if (response.status === 401) {
      cookies.remove('token');
      cookies.set('user', false);

    }
    if (response.status === 422) {
      document.getElementById('errorMessage').innerHTML = "Preencha todos os campos.";
    }
    if (responseBody.result) {
      setEconomia(responseBody.result.economia);
      setPotencial(responseBody.result.potencial);
      let parcelamento = responseBody.result.parcelamento;
      setParcelamento(parcelamento);

      setType('result');
    }
  };



  if (type === 'simulated') {
    return (
      <ArticleAlignCenterLeft>
        <header className="article-header">Simulador</header>
        <p id="errorMessage"></p>
        <form className="flex-column" onSubmit={handleSubmit}>
          <label>
            <input onChange={handleChange} type="text" name="cep" placeholder="CEP" />
          </label>
          <label>
            <input onChange={handleChange} type="text" name="value" placeholder="Valor da conta de energia" />
          </label>
          <label>
            <input onChange={handleChange} type="text" name="struct" placeholder="Tipo de Telhado" />
          </label>
          <button>Salvar</button>
        </form>
      </ArticleAlignCenterLeft>
    );
  } else {
    return (
      <ArticleAlignCenterLeft>
        <header className="article-header">Resultado</header>
        <p id="errorMessage"></p>
        <p>Economia: {economia.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
        <p>Potencial: {potencial}</p>
        {parcelamento.map((value) =>
          <section className="sectionPd">
            <p>Parcelas:{value.parcelas}</p>
            <p>Taxa Minima: {value.taxa_minina.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })},
              Taxa Maxima: {value.taxa_maxima.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}, Valor Maximo: {value.valor_maximo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })},
              Valor Minimo: {value.valor_minimo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>

          </section>
        )}


      </ArticleAlignCenterLeft>
    );
  }

}




export default Simulated;
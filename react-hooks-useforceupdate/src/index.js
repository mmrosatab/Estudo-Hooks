import ReactDOM from "react-dom";
import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

const App = () => {
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState({});

  /* similar componentDidMount */
  useEffect(() => {
    fetch("https://api.github.com/orgs/ggobi/repos")
      .then(response => response.json())
      .then(data => setRepositories(data))
      .catch(error => console.log(error));
  }, []);

  /* similar componentDidUpdate */
  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite);
    document.title = `Você tem ${filtered.favorite} favoritos`;
  }, [repositories]);

  useEffect(() => {
    navigator.geolocation.watchPosition(handlePositionReceived);
  }, []);

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo;
    });
    setRepositories(newRepositories);
  }

  /* similar componentDidUnmouted */
  useEffect(() => {
    const wacthId = navigator.geolocation.watchPosition(handlePositionReceived);
    return () => navigator.geolocation.clearWatch(wacthId);
  }, []);

  return (
    <Container>
      <StyledUl>
        {repositories.map(repo => (
          <StyledLi key={repo.id}>
            {repo.name}
            {repo.favorite && <span>(Fav)</span>}
            <button onClick={() => handleFavorite(repo.id)}>Fav</button>
          </StyledLi>
        ))}
      </StyledUl>

      <StyledDiv>
        <ul>
          <li>Latitude: {location.latitude}</li>
          <li>Longitude: {location.longitude} </li>
        </ul>
      </StyledDiv>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1%;
  padding: 2%;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 1%;
  padding: 2%;
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1%;
  padding: 2%;
`;

const StyledLi = styled.li`
  display: flex;
  justify-content: space-between;
`;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

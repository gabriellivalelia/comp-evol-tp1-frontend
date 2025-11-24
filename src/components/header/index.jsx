import { Link } from "react-router-dom";
import {
  Logo,
  LogoContainer,
  MainContainer,
  NavBar,
  NavBarHover,
} from "./styles";
import LogoSrc from "../../assets/logos/logo.png";

function Header() {
  return (
    <MainContainer>
      <LogoContainer>
        <Logo src={LogoSrc} />
      </LogoContainer>
      <NavBar>
        <Link to="/">
          <NavBarHover>Início</NavBarHover>
        </Link>
        <Link to="/aboutTheCompetition">
          <NavBarHover>O Comida di Buteco</NavBarHover>
        </Link>
        <Link to="/aboutTheProject">
          <NavBarHover>Sobre o projeto</NavBarHover>
        </Link>
        <Link to="/filters">
          <NavBarHover>Encontre a sua rota</NavBarHover>
        </Link>
      </NavBar>
    </MainContainer>
  );
}

export default Header;

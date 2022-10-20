import "./App.css";
import Navigation from "./components/Navigation";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import { UserContext } from "./context/userContext";
import Account from "./pages/Account";

function App() {
  const [userInfo, setUserInfo] = useState({email: null, password: null});

  const logout = () => {
    setUserInfo({email: null, password: null})
  }

  return (
    <>
    <UserContext.Provider value={{userInfo, setUserInfo, logout}}>
      <Navigation />
      <div class="container-lg">
        <div class="row">
          <div class="col-md-6 offset-md-3">{!userInfo.email && <Homepage />}</div>
          <div class="col-md-6 offset-md-3">{userInfo.email && <Account />}</div>
        </div>
      </div>
      </UserContext.Provider>
    </>
  );
}

export default App;

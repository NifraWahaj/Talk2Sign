import React from 'react';
// Correct path to Welcome component
import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import Welcome from './Pages/welcome'; 
import AboutUs from './Pages/AboutUs'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import EnterYTLink from './Pages/Enter-YT-Link'
import Upload from './Pages/Upload'
import AudioText from './Pages/Audio-Text'
import AudioTexttoASL from './Pages/Text-Audio-to-ASL'
import ConfirmorCancelUpload from './Pages/Confirm-or-Cancel-Upload'
import ConfirmorCancelUpload2 from './Pages/Confirm-or-Cancel-Upload2'
import YtToASL from './Pages/Yt-to-ASL'
import ForgotPassword from './Pages/ForgotPassword'
import Code from './Pages/Code'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome/>}/> 
        <Route path="/AboutUs" element={<AboutUs/>}/>
        <Route path="/Login" element={<Login/>}/> 
        <Route path="/SignUp" element={<SignUp/>}/> 
        <Route path="/Enter-YT-Link" element={<EnterYTLink/>}/> 
        <Route path="/Upload" element={<Upload/>}/>
        <Route path="/Audio-Text" element={<AudioText/>}/>
        <Route path="/Text-Audio-to-ASL" element={<AudioTexttoASL/>}/>
        <Route path="/Confirm-or-Cancel-Upload" element={<ConfirmorCancelUpload/>}/>
        <Route path="/Confirm-or-Cancel-Upload2" element={<ConfirmorCancelUpload2/>}/>
        <Route path="/Yt-to-ASL" element={<YtToASL/>}/>
        <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
        <Route path="/Code" element={<Code/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

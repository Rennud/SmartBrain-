import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import Clarifai from 'clarifai';

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useState } from "react";

const particlesOptions = {

  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 200,
        duration: 1,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      directions: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 1000,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
}


const app = new Clarifai.App({
  apiKey: 'af9909da70b9420c955eaf08deb4f350'
});


function App() {
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [box, setBox] = useState({})
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await container;
  }, []);

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  const displayFaceBox = (box) => {
    console.log(box)
    setBox(box)}


  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const onBtnSubmit = () => {
    setImageUrl(input)
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      input)
    .then(response => displayFaceBox(calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  return (
    <div className="App">
      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions}
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
        {route === 'home'
          ? <>
              <Logo />
              <Rank />
              <ImageLinkForm onChange={onInputChange} onClick={onBtnSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </>
          : (
            route === 'signin'
            ? <SignIn onClick={onRouteChange}/>
            : <Register onClick={onRouteChange}/>
          )
     }
    </div>
  );
}

export default App;

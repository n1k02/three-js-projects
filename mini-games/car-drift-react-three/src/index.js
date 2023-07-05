import ReactDOM, {createRoot} from 'react-dom/client';
import './index.css';
import {Canvas} from "@react-three/fiber";
import Scene from "./Scene";
import {Physics} from "@react-three/cannon";


createRoot(document.getElementById('root')).render(
    <Canvas>
        <Physics
            broadphase={'SAP'}
            gravity={[0, -9.6, 0]}
        >
            <Scene/>
        </Physics>
    </Canvas>
)
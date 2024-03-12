import { useRef } from "react";
import { Box } from '@react-three/drei'
import { ThreeElements, useThree } from "@react-three/fiber";

export const CreateBox = (props: ThreeElements['mesh']) => {
    const ref = useRef<any>();
    const { scene } = useThree();
    
    return (
        
        
        <Box ref={ref} />
    );
}
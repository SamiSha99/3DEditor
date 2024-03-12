import * as THREE from 'three';
import { Box, Select } from '@react-three/drei';
import { useThree } from'@react-three/fiber'


export function AddPrimitive(primitive : any) {
    useThree().scene.add(primitive);
}
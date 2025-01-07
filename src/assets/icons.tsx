import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
    faMountainSun,
    faCube,
    faCircleNodes,
    faPersonRunning,
    faCircleHalfStroke,
    faCheck,
    faX
} from '@fortawesome/free-solid-svg-icons';

export const IconScene = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faMountainSun} /> }
export const IconObject = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faCube} /> }
export const IconGeometry = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faCircleNodes} /> }
export const IconAnimation = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faPersonRunning} /> }
export const IconMaterial = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faCircleHalfStroke} /> }
export const Check = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faCheck} /> }
export const X = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faX} /> }
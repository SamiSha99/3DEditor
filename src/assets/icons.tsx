import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { faMountainSun, faCube, faCircleNodes, faPersonRunning, faPaintBrush } from '@fortawesome/free-solid-svg-icons';

export const IconScene = (props: Partial<FontAwesomeIconProps>) => {
    return <FontAwesomeIcon {...props} icon={faMountainSun} />
}

export const IconObject = (props: Partial<FontAwesomeIconProps>) => {
    return <FontAwesomeIcon {...props} icon={faCube} />
}

export const IconGeometry = (props: Partial<FontAwesomeIconProps>) => {
    return <FontAwesomeIcon {...props} icon={faCircleNodes} />
}

export const IconAnimation = (props: Partial<FontAwesomeIconProps>) => {
    return <FontAwesomeIcon {...props} icon={faPersonRunning} />
}

export const IconMaterial = (props: Partial<FontAwesomeIconProps>) => {
    return <FontAwesomeIcon {...props} icon={faPaintBrush} />
}
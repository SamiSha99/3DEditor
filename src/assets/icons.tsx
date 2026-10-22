import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faCircleNodes,
    faPersonRunning,
    faCircleHalfStroke,
    faCheck,
    faX,
    IconDefinition,
    faArrowLeft,
    faArrowRight,
    faMountain
} from '@fortawesome/free-solid-svg-icons';

// also to-do: by doing something with these cause not used lol
export const Check = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} color='#6CB4EE' icon={faCheck} /> }
export const X = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} color='#888' icon={faX} /> }

export const Left = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faArrowLeft} /> }
export const Right = (props: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={faArrowRight} /> }

// to-do: use these icons to like anything!!!!!!!!!!!!
export const Icon = (icon: IconDefinition, props?: Partial<FontAwesomeIconProps>) => { return <FontAwesomeIcon {...props} icon={icon} /> }

// For convenience just pass the key name to get the font awesome icon
// TODO fix this hsit comment ^
const tabIconCollection = {
    Scene: { icon: faMountain, title: "Scene" },
    Object: { icon: faCube, title: "Object" },
    Animation: { icon: faPersonRunning, title: "Animation" },
    Geometry: { icon: faCircleNodes, title: "Geometry" },
    Material: { icon: faCircleHalfStroke, title: "Material" }
};

export type TabIcon = keyof typeof tabIconCollection;

interface TabIconProps {
    iconType: TabIcon;
    props?: Partial<FontAwesomeIconProps>;
}

export const TabIcon = (props: TabIconProps) => {
    const { iconType } = props;
    return <FontAwesomeIcon style={{ verticalAlign: "bottom", textAlign: "start"}} size='lg' {...props} icon={tabIconCollection[iconType].icon} />
}
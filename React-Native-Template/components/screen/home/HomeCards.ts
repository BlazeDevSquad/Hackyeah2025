import { Focus, Image, LucideIcon } from 'lucide-react-native';
import {
  MessageCircle,
  ShoppingCart,
  Bell,
  Languages,
  DollarSign,
  Palette,
} from 'lucide-react-native';

export const features: {
  id: string;
  icon: LucideIcon;
  route: string;
  name: string;
}[] = [
  {
    id: '0',
    icon: MessageCircle,
    route: '(features)/chatgpt',
    name: 'Open AI',
  },
  {
    id: '1',
    icon: MessageCircle,
    route: '(features)/claude',
    name: 'Anthropic',
  },
  {
    id: '2',
    icon: Image,
    route: '(features)/replicate',
    name: 'Replicate AI',
  },
  {
    id: '3',
    icon: Image,
    route: '(features)/fal',
    name: 'Fal AI',
  },
  {
    id: '4',
    icon: Focus,
    route: '(features)/identifier',
    name: 'Image Identifier',
  },
  {
    id: '5',
    icon: ShoppingCart,
    route: 'paywall-single',
    name: 'Paywall - Single',
  },
  {
    id: '6',
    icon: ShoppingCart,
    route: 'paywall-double',
    name: 'Paywall - Double',
  },
  {
    id: '7',
    icon: Bell,
    name: 'Notifications',
    route: 'settings/notifications',
  },
  {
    id: '8',
    icon: Languages,
    name: 'Language',
    route: 'settings/language',
  },
  {
    id: '9',
    icon: DollarSign,
    name: 'Admob',
    route: 'admob',
  },
  {
    id: '10',
    icon: Palette,
    route: 'settings/theme',
    name: 'Theme',
  },
];

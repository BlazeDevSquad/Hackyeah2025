import {
  Pencil,
  CreditCard,
  Sun,
  Bell,
  HelpCircle,
  Settings,
  LucideIcon,
} from 'lucide-react-native';

type MenuItem = {
  icon: LucideIcon;
  text: string;
  route: string;
};

export const menuItems: MenuItem[] = [
  {
    // you can use it like that with i18n
    // text: 'profile.edit', -> Go to the i18n file and add the key
    // Then go to the Profile Page and add this:
    // <ThemedText type="title">{t(item.text)}</ThemedText>
    // something like that but you got the point.
    icon: Pencil,
    text: 'Edit Profile',
    route: '/profile',
  },
  {
    icon: CreditCard,
    text: 'Subscription',
    route: '/profile',
  },
  {
    icon: Sun,
    text: 'Theme',
    route: '/settings/theme',
  },
  {
    icon: Bell,
    text: 'Notifications',
    route: '/settings/notifications',
  },
  {
    icon: HelpCircle,
    text: 'Help',
    route: '/settings/help',
  },
  {
    icon: Settings,
    text: 'Settings',
    route: '/settings',
  },
];

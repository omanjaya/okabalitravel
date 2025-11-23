/**
 * Premium Icon Library - Phosphor Icons
 * Centralized icon mapping for consistent usage across the application
 */

import {
  // Navigation
  House,
  MagnifyingGlass,
  User,
  Heart,
  SignOut,
  SquaresFour,
  BookOpen,
  Gear,
  List,
  X,

  // Travel & Features
  Calendar,
  MapPin,
  Star,
  Clock,
  Users,
  Package,
  Camera,
  ShareNetwork,
  Plus,
  Check,
  AirplaneTilt,
  Tent,
  BeachBall,
  Mountains,
  Island,
  ForkKnife,
  Church,
  Waves,
  Compass,
  SunHorizon,
  FirstAid,
  ShieldCheck,

  // Actions
  ArrowRight,
  ArrowLeft,
  ArrowClockwise,
  ArrowsLeftRight,
  Upload,
  Download,
  Trash,
  PencilSimple,

  // Status & Feedback
  CheckCircle,
  XCircle,
  WarningCircle,
  Info,
  Spinner,

  // Communication
  ChatCircle,
  Bell,
  Envelope,
  Phone,

  // Media
  Image as ImageIcon,
  PlayCircle,
  PauseCircle,

  // Business
  CreditCard,
  Money,
  Receipt,
  Ticket,

  // Interface
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  DotsThreeVertical,
  Funnel,
  SortAscending,
  Eye,
  EyeSlash,
  LockKey,

  // Social
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  WhatsappLogo,
  LinkedinLogo,

  // Premium Bali-Specific
  Umbrella,
  Boat,
  Fish,
  Tree,
  Leaf,
  Palette,
  MusicNotes,

  // Utility
  Headset,
  Medal,
  Trophy,
  Fire,
  Lightning,
  WifiSlash,

  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

/**
 * Centralized icon registry
 * Usage: import { Icons } from '@/lib/icons';
 * Example: <Icons.home size={24} weight="regular" />
 */
export const Icons = {
  // Navigation Icons
  home: House,
  search: MagnifyingGlass,
  user: User,
  heart: Heart,
  signOut: SignOut,
  dashboard: SquaresFour,
  book: BookOpen,
  settings: Gear,
  menu: List,
  close: X,

  // Travel Icons
  calendar: Calendar,
  location: MapPin,
  mapPin: MapPin,
  star: Star,
  clock: Clock,
  time: Clock,
  users: Users,
  people: Users,
  package: Package,
  camera: Camera,
  share: ShareNetwork,
  airplane: AirplaneTilt,
  tent: Tent,
  beach: BeachBall,
  mountain: Mountains,
  island: Island,
  food: ForkKnife,
  restaurant: ForkKnife,
  temple: Church,
  waves: Waves,
  ocean: Waves,
  compass: Compass,
  explore: Compass,
  sunset: SunHorizon,
  medical: FirstAid,
  shield: ShieldCheck,
  verified: ShieldCheck,

  // Action Icons
  add: Plus,
  plus: Plus,
  check: Check,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  refresh: ArrowClockwise,
  compare: ArrowsLeftRight,
  upload: Upload,
  download: Download,
  delete: Trash,
  trash: Trash,
  edit: PencilSimple,
  pencil: PencilSimple,

  // Status Icons
  checkCircle: CheckCircle,
  success: CheckCircle,
  xCircle: XCircle,
  error: XCircle,
  warning: WarningCircle,
  info: Info,
  loading: Spinner,
  spinner: Spinner,

  // Communication Icons
  chat: ChatCircle,
  message: ChatCircle,
  bell: Bell,
  notification: Bell,
  email: Envelope,
  mail: Envelope,
  phone: Phone,
  call: Phone,
  support: Headset,
  headset: Headset,

  // Media Icons
  image: ImageIcon,
  play: PlayCircle,
  pause: PauseCircle,

  // Business Icons
  card: CreditCard,
  creditCard: CreditCard,
  money: Money,
  receipt: Receipt,
  ticket: Ticket,
  booking: Ticket,
  medal: Medal,
  award: Medal,
  trophy: Trophy,

  // Interface Icons
  caretLeft: CaretLeft,
  caretRight: CaretRight,
  caretDown: CaretDown,
  caretUp: CaretUp,
  moreVertical: DotsThreeVertical,
  dots: DotsThreeVertical,
  filter: Funnel,
  sort: SortAscending,
  eye: Eye,
  eyeSlash: EyeSlash,
  lock: LockKey,
  secure: LockKey,

  // Social Media Icons
  facebook: FacebookLogo,
  twitter: TwitterLogo,
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  linkedin: LinkedinLogo,

  // Premium Bali Travel Icons
  umbrella: Umbrella,
  parasol: Umbrella,
  boat: Boat,
  cruise: Boat,
  fish: Fish,
  diving: Fish,
  tree: Tree,
  nature: Tree,
  leaf: Leaf,
  eco: Leaf,
  art: Palette,
  culture: Palette,
  music: MusicNotes,
  dance: MusicNotes,
  fire: Fire,
  hot: Fire,
  trending: Fire,
  lightning: Lightning,
  fast: Lightning,
  wifiSlash: WifiSlash,
  offline: WifiSlash,
} as const;

// Export type for TypeScript autocomplete
export type IconName = keyof typeof Icons;
export type { PhosphorIcon };

/**
 * Icon size presets for consistency
 */
export const IconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

/**
 * Icon weight presets
 * Phosphor supports: thin, light, regular, bold, fill, duotone
 */
export const IconWeights = {
  thin: 'thin',
  light: 'light',
  regular: 'regular',
  bold: 'bold',
  fill: 'fill',
  duotone: 'duotone',
} as const;

/**
 * Helper function to get icon with default props
 */
export function getIcon(name: IconName) {
  return Icons[name];
}

import * as React from 'react';

// Schedule
import { Button, IconButton, Popover, Stack } from '@contentful/f36-components';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// Arrows
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// Media
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
// Social media
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
// TikTok is not in the MUI group. Will send separately.
// Communications
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import CommentIcon from '@mui/icons-material/Comment';
import WifiIcon from '@mui/icons-material/Wifi';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
// Actions
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
// Inclusivity
import Diversity1Icon from '@mui/icons-material/Diversity1';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StrollerIcon from '@mui/icons-material/Stroller';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import ElderlyIcon from '@mui/icons-material/Elderly';
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
// Money
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceIcon from '@mui/icons-material/Place';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

const styles = {
  wrap: css`
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    max-width: 400px;
    max-height: 250px;
    overflow: auto;
  `,
};

interface Props {
  leadingIcon?: string;
  trailingIcon?: string;
  inputTitle: string;
  onSelect: (icon?: [string, React.ReactNode]) => void;
}

export const Icons: Record<string, React.ReactNode> = {
  none: <>None</>,
  // Schedule
  AccessTimeIcon: <AccessTimeIcon />,
  CalendarTodayIcon: <CalendarTodayIcon />,
  PlaceIcon: <PlaceIcon />,
  // Arrows
  ArrowBackIcon: <ArrowBackIcon />,
  ArrowForwardIcon: <ArrowForwardIcon />,
  ArrowDownwardIcon: <ArrowDownwardIcon />,
  ArrowUpwardIcon: <ArrowUpwardIcon />,
  ArrowDropDownIcon: <ArrowDropDownIcon />,
  ArrowDropUpIcon: <ArrowDropUpIcon />,
  ExpandLessIcon: <ExpandLessIcon />,
  ExpandMoreIcon: <ExpandMoreIcon />,
  ChevronLeftIcon: <ChevronLeftIcon />,
  ChevronRightIcon: <ChevronRightIcon />,
  // Media
  AudiotrackIcon: <AudiotrackIcon />,
  HeadphonesIcon: <HeadphonesIcon />,
  VideocamIcon: <VideocamIcon />,
  PlayCircleOutlineIcon: <PlayCircleOutlineIcon />,
  ArticleIcon: <ArticleIcon />,
  // Social media
  InstagramIcon: <InstagramIcon />,
  FacebookIcon: <FacebookIcon />,
  YouTubeIcon: <YouTubeIcon />,
  LinkedInIcon: <LinkedInIcon />,
  TikTokIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 24 24"
      width="20px"
      height="20px"
    >
      <g>
        <g id="Layer_1">
          <path
            style={{ fill: '#212121' }}
            d="M21,0H3C1.3,0,0,1.3,0,3v18c0,1.7,1.3,3,3,3h18c1.7,0,3-1.3,3-3V3c0-1.7-1.3-3-3-3ZM19.3,10.3c-1.5,0-2.9-.5-4-1.3v5.8c0,2.9-2.4,5.3-5.3,5.3s-2.2-.4-3-1c-1.4-1-2.3-2.5-2.3-4.3,0-2.9,2.4-5.3,5.3-5.3s.5,0,.7,0v2.9c-.2,0-.5-.1-.7-.1-1.3,0-2.4,1.1-2.4,2.4s.5,1.7,1.3,2.1c.3.2.7.3,1.1.3,1.3,0,2.4-1,2.4-2.3V3.4h2.9c0,.2,0,.5,0,.7.2,1.1.9,2,1.8,2.6h0c.6.4,1.4.7,2.2.7v2.9Z"
          />
        </g>
      </g>
    </svg>
  ),
  // TikTok is not in the MUI group. Will send separately.
  // Communications
  EmailIcon: <EmailIcon />,
  CallIcon: <CallIcon />,
  CommentIcon: <CommentIcon />,
  WifiIcon: <WifiIcon />,
  InfoIcon: <InfoIcon />,
  HelpIcon: <HelpIcon />,
  // Actions
  SearchIcon: <SearchIcon />,
  CloseIcon: <CloseIcon />,
  DownloadIcon: <DownloadIcon />,
  OpenInNewIcon: <OpenInNewIcon />,
  AddIcon: <AddIcon />,
  AddCircleOutlineIcon: <AddCircleOutlineIcon />,
  RemoveIcon: <RemoveIcon />,
  RemoveCircleOutlineIcon: <RemoveCircleOutlineIcon />,
  CancelIcon: <CancelIcon />,
  ShareIcon: <ShareIcon />,
  LinkIcon: <LinkIcon />,
  // Inclusivity
  AccessibleIcon: <AccessibleIcon />,
  AccessibleForwardIcon: <AccessibleForwardIcon />,
  AccessibilityNewIcon: <AccessibilityNewIcon />,
  AllInclusiveIcon: <AllInclusiveIcon />,
  Diversity1Icon: <Diversity1Icon />,
  Diversity2Icon: <Diversity2Icon />,
  Diversity3Icon: <Diversity3Icon />,
  StrollerIcon: <StrollerIcon />,
  ChildFriendlyIcon: <ChildFriendlyIcon />,
  ElderlyIcon: <ElderlyIcon />,
  ElderlyWomanIcon: <ElderlyWomanIcon />,
  // Money
  CreditCardIcon: <CreditCardIcon />,
  AttachMoneyIcon: <AttachMoneyIcon />,
  ShoppingCartIcon: <ShoppingCartIcon />,
};

export function IconPopover(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [leadingIcon, setLeadingIcon] = React.useState<[string, React.ReactNode] | undefined>();
  const [trailingIcon, setTrailingIcon] = React.useState<[string, React.ReactNode] | undefined>();

  React.useEffect(() => {
    if (props.leadingIcon) {
      return setLeadingIcon([props.leadingIcon, Icons[props.leadingIcon]]);
    }
    setLeadingIcon(undefined);
  }, [props.leadingIcon]);

  React.useEffect(() => {
    if (props.trailingIcon) {
      return setTrailingIcon([props.trailingIcon, Icons[props.trailingIcon]]);
    }
    setTrailingIcon(undefined);
  }, [props.trailingIcon]);

  const select = (name, icon) => () => {
    if (name === 'none') {
      props.onSelect();
      return setIsOpen(false);
    }
    props.onSelect([name, icon]);
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Popover.Trigger>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          startIcon={leadingIcon?.[1] as any}
          endIcon={trailingIcon?.[1] as any}
        >
          {props.inputTitle}
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Stack flexDirection="row" className={styles.wrap}>
          {Object.entries(Icons).map((value) => (
            <IconButton
              key={value[0]}
              aria-label={value[0]}
              icon={<>{value[1]}</>}
              onClick={select(value[0], value[1])}
            />
          ))}
        </Stack>
      </Popover.Content>
    </Popover>
  );
}

import './CardDisplay.css';

import { CARD_IMAGE_BASE_PATH } from '../../../core/global';
import { Card, cardToString } from '../core/cards';

function CardDisplay(props: { card: Card }) {
  let code = cardToString(props.card);
  if (code === 'Xx') code = 'Reverse';
  return (
    <img src={`${CARD_IMAGE_BASE_PATH}${code}.png`} alt={`${code}`} className={`playing-card ${code === 'Reverse' ? 'playing-card-reversed' : ''}`} draggable={false} />
  );
}

export default CardDisplay;
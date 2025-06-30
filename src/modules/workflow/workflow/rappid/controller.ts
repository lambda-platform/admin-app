import { mvc } from '@clientio/rappid/rappid';
import RappidService from '../services/rappid.service';
import { SharedEvents } from './shared-events';

export abstract class Controller extends mvc.Listener<[RappidService]> {
  constructor(public readonly service: RappidService) {
    super(service);
    this.startListening();
  }

  abstract startListening(): void;
}

import { Component } from '@angular/core';

import { ShowHRType } from 'app/modules/ecg/interfaces';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';

@Component({
  selector: 'app-episode-hr-text',
  templateUrl: './episode-hr-text.component.html',
  styleUrls: ['./episode-hr-text.component.scss']
})
export class EpisodeHRTextComponent {
	readonly ShowHRType = ShowHRType
	
	constructor(
		public ecgDto: EcgDto,
		public config: EcgStripConfigDto) {
	}
}

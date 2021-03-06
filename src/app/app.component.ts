import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AdminService } from './shared/admin.service';
import { AuthService } from './shared/auth.service';
import { SessionService } from './shared/session.service';
import { SpeakerService } from './shared/speaker.service';
import { TransitionService } from './shared/transition.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user;

  constructor(private adminService: AdminService,
              private sessionService: SessionService,
              private speakerService: SpeakerService,
              private authService: AuthService,
              private transitionService: TransitionService,
              private router: Router) {
    this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    // Check session for credentials to skip login splash screen
    this.authService.checkSession()
        .then(user => {
          if (user && user.admin) {
              this.router.navigate(['/home']);
          } else if (user && !user.admin) {
              this.router.navigate(['/dashboard']);
          }
        });
    this.adminService.getAllConferences();
    this.sessionService
        .getAllSessions()
        .then(res => this.speakerService.getAllSpeakers());
  }

  logout() {
    this.authService.logout()
        .then(res => {
          this.router.navigate(['/']);
        });
  }

  // 2017 Conference ~ May 22-25, 2017
  getTitleText() {
    if (!this.adminService.defaultConference.getValue()) return '';
    let conf = this.adminService.defaultConference.getValue();
    let dateStart = moment(conf.dateRange.start);
    let dateEnd = moment(conf.dateRange.end);
    let dateText = `${dateStart.format('MMM')} ${dateStart.format('D')}-${dateEnd.format('D')}, ${dateEnd.format('YYYY')}`
    // let title = `${conf.title}`;
    let title = `CCAW ~ ${dateText}`;
    return title;
  }

}

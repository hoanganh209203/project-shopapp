import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/clients/header/header.component';
import { BannerComponent } from '../../components/clients/banner/banner.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/clients/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, BannerComponent, RouterOutlet, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { BannerComponent } from "../../components/banner/banner.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, BannerComponent, RouterOutlet, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

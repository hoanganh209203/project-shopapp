import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  NgApexchartsModule,
  ApexMarkers,
  ApexTooltip,
} from 'ng-apexcharts';
import { OrderService } from '../../../service/orders/order.service';
import { OrderStatisticsDTO } from '../../../dtos/orders/order.statistics.dto';

@Component({
  selector: 'app-order-statistics-daily',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './order-statistics-daily.component.html',
  styleUrl: './order-statistics-daily.component.scss',
})
export class OrderStatisticsDailyComponent implements OnInit {
  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getDailyStatistics(); // Gọi API khi component được khởi tạo
  }

  private initChartData(dates: any[]): void {
    // Cấu hình cơ bản cho biểu đồ
    this.series = [
      {
        name: 'Total Revenue',
        data: dates, // Gán dữ liệu đã chuyển đổi vào series
      },
    ];

    this.chart = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    };

    this.dataLabels = {
      enabled: false,
    };

    this.markers = {
      size: 0,
    };

    this.title = {
      text: 'Thống kê doanh thu hàng ngày',
      align: 'center',
      style: {
        color: '#444',
        fontSize: '21px',
      },
    };

    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };

    this.yaxis = {
      labels: {
        formatter: function (val) {
          return val.toLocaleString('vi-VN') + ' VND'; // Hiển thị giá VND
        },
      },
      title: {
        text: 'Doanh thu (VND)',
      },
    };

    this.xaxis = {
      type: 'datetime', // Đảm bảo trục X là loại datetime
      labels: {
        format: 'yyyy-MM-dd', // Định dạng ngày mong muốn trên trục X
      },
    };

    this.tooltip = {
      shared: false,
      x: {
        format: 'dd MMM yyyy', // Định dạng ngày trong tooltip
      },
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0) + 'M'; // Định dạng giá trị hiển thị trong tooltip
        },
      },
    };
  }

  private getDailyStatistics(): void {
    this.orderService.getDailyStatistics().subscribe(
      (data: any[]) => {
        const formattedData = this.formatChartData(data); // Chuyển đổi dữ liệu từ API
        this.initChartData(formattedData); // Khởi tạo biểu đồ với dữ liệu
      },
      (error) => {
        console.error('Error fetching daily statistics', error);
      }
    );
  }

  private formatChartData(data: any[]): any[] {
    return data.map((stat) => {
      const timestamp = new Date(stat.date).getTime(); // Chuyển đổi date thành timestamp
      const value = stat.totalRevenue; // Lấy giá trị doanh thu
      return [timestamp, value]; // Trả về cặp [timestamp, giá trị doanh thu]
    });
  }
}

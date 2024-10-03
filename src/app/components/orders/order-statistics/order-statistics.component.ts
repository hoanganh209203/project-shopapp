import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderStatisticsDTO } from '../../../dtos/orders/order.statistics.dto';
import { OrderService } from '../../../service/orders/order.service';
import { CommonModule, NgFor } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-order-statistics',
  standalone: true,
  imports: [NgFor, CommonModule, NgApexchartsModule],
  templateUrl: './order-statistics.component.html',
  styleUrl: './order-statistics.component.scss',
})
export class OrderStatisticsComponent implements OnInit {
  public totalOrders: number = 0;
  public totalRevenue: number = 0;
  monthNames = [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Doanh thu',
        data: [], // Dữ liệu sẽ được cập nhật
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top', // Đặt nhãn trên đỉnh
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toLocaleString('vi-VN'); // Hiển thị giá VND
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      categories: this.monthNames, // Gán danh sách tháng vào trục hoành
      position: 'bottom',
      labels: {
        offsetY: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      },
    },
    fill: {
      type: 'solid',
    },
    yaxis: {
      title: {
        text: 'Doanh thu (VND)',
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val.toLocaleString('vi-VN') + ' VND'; // Hiển thị giá VND
        },
      },
    },
    title: {
      text: 'Thống kê doanh thu hàng tháng',
      align: 'center',
      style: {
        color: '#444',
        fontSize: '21px',
      },
    },
  };

  constructor(private orderStatisticsService: OrderService) {}

  ngOnInit() {
    // Gọi hàm lấy thống kê hàng tháng
    this.fetchMonthlyStatistics();
  }

  fetchMonthlyStatistics() {
    this.orderStatisticsService.getMonthlyStatistics().subscribe({
      next: (data) => {
        console.log(data); // Kiểm tra dữ liệu nhận được

        // const monthNames = [
        //   'Tháng Một',
        //   'Tháng Hai',
        //   'Tháng Ba',
        //   'Tháng Tư',
        //   'Tháng Năm',
        //   'Tháng Sáu',
        //   'Tháng Bảy',
        //   'Tháng Tám',
        //   'Tháng Chín',
        //   'Tháng Mười',
        //   'Tháng Mười Một',
        //   'Tháng Mười Hai',
        // ];

        const revenueData = Array(12).fill(0);
        let totalOrdersCount = 0;
        let totalRevenueAmount = 0;

        if (Array.isArray(data) && data.length > 0) {
          data.forEach((stat) => {
            const month = parseInt(stat.date.split('-')[1], 10) - 1;

            if (month >= 0 && month < 12) {
              revenueData[month] += stat.totalRevenue || 0; // Sử dụng += để cộng dồn doanh thu nếu có nhiều thống kê cho tháng
              totalOrdersCount += stat.totalOrders || 0;
              totalRevenueAmount += stat.totalRevenue || 0;
            } else {
              console.error('Chỉ số tháng không hợp lệ:', month);
            }
          });
        } else {
          console.error('Dữ liệu không hợp lệ hoặc trống:', data);
        }

        this.chartOptions.series![0].data = revenueData;
        // this.chartOptions.xaxis!.categories = monthNames;

        this.totalOrders = totalOrdersCount;
        this.totalRevenue = totalRevenueAmount;

        this.chart.updateOptions(this.chartOptions);
      },
      error: (err) => {
        console.error('Có lỗi xảy ra khi gọi API:', err);
      },
    });
  }
}

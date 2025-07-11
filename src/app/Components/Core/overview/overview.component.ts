import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { pipe } from 'rxjs';
import { CardComponent } from '../../Shared/card/card.component';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, CardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  tabledata = [
    {
      label: 'Total Bookings',
      count: 1278,
      detail: 'All time bookings',
      percentage: '12% from last month',
      grow: true,
      image:
        'https://assets-dev.travelhouseuk.co.uk/assets/images/dashboard/total-bookings.svg',
    },
    {
      label: 'Active Users',
      count: 3427,
      detail: 'Last 15 days',
      percentage: '8% from last month',
      grow: true,
      image:
        'https://assets-dev.travelhouseuk.co.uk/assets/images/dashboard/active-users.svg',
    },
    {
      label: 'Notifications Sent',
      count: 348,
      detail: 'Last 15 days',
      percentage: '2% from last month',
      grow: false,
      image:
        'https://assets-dev.travelhouseuk.co.uk/assets/images/dashboard/notifications-sent.svg',
    },
    {
      label: 'Search Activity',
      count: 12849,
      detail: 'Last 15 days',
      percentage: '24% from previous period',
      grow: true,
      image:
        'https://assets-dev.travelhouseuk.co.uk/assets/images/dashboard/search-activity.svg',
    },
  ];
}

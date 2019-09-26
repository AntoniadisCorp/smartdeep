export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    divider: true,
  },
  {
    name: 'Inventory',
    url: '/inventory',
    icon: 'icon-drawer',
  },
  {
    name: 'Orders',
    url: '/orders',
    icon: 'icon-drawer',
  },
  {
    name: 'Shipments',
    url: '/shipments',
    icon: 'icon-drawer',
  },
  {
    divider: true,
  },
  {
    name: 'Purchase Orders',
    url: '/purchase_orders',
    icon: 'icon-drawer',
  },
  {
    divider: true,
  },
  {
    title: true,
    name: 'Smart Home'
  },
  {
    name: 'Listing',
    url: '/listing',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Buttons',
        url: '/listing/buttons',
        icon: 'icon-puzzle'
      },
      {
        name: 'Social Buttons',
        url: '/listing/social-buttons',
        icon: 'icon-puzzle'
      },
      {
        name: 'Cards',
        url: '/listing/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/listing/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Modals',
        url: '/listing/modals',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/listing/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/listing/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/listing/tabs',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Smart Car',
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        },
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star',
        children: [
          {
            name: 'Fonts v5',
            url: '/icons/font-awesomev3',
            icon: 'icon-star',
            badge: {
              variant: 'secondary',
              text: '5'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Delivery',
    url: '/delivery',
    icon: 'fa fa-delicious',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Analytics',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    divider: true,
  },
  {
    title: true,
    name: 'Smart Shop',
  },
  {
    name: 'SmartEngine',
    url: '/smartengine',
    icon: 'icon-magnifier',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Devices',
    url: '/devices',
    icon: 'fa fa-microchip',
    badge: {
      variant: 'accent',
      text: 'NEW'
    }
  },
  {
    name: 'Pages',
    url: '/extern',
    icon: 'fa fa-sticky-note',
    children: [
      {
        name: 'Login',
        url: '/extern/login',
        icon: 'icon-lock'
      },
      {
        name: 'Register',
        url: '/extern/register',
        icon: 'icon-people'
      }
    ]
  },
  {
    name: 'Download CoreUI',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success'
  },
  {
    name: 'Try CoreUI PRO',
    url: 'http://coreui.io/pro/angular/',
    icon: 'icon-layers',
    variant: 'danger'
  }
];

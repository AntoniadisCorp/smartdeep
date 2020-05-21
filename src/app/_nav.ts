export const navigation = [
  {
    name: 'Αρχική Σελίδα',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    divider: true,
  },
  {
    name: 'Βιβλιοθήκη',
    url: '/library',
    icon: 'icon-notebook',

    children: [
      {
        name: 'Χωροθέτηση',
        url: '/library/map', // bookcase, categories
        icon: 'icon-map'
      },
      {
        name: 'Βιβλία',
        url: '/library/book',
        icon: 'icon-book-open'
      },
      {
        name: 'Κατανομή',
        url: '/library/allocation', // authors, publishers, book contents
        icon: 'icon-layers'
      },
      {
        name: 'Δανεισμός',
        url: '/library/lending', // authors, publishers, book contents
        icon: 'icon-note'
      },
    ]
  },
  {
    name: 'Αναζήτηση',
    url: '/smartengine',
    icon: 'icon-magnifier',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Αναλυτικά',
    url: '/charts',
    icon: 'icon-pie-chart'
  },

  /* {
    name: 'Delivery',
    url: '/delivery',
    icon: 'fa fa-delicious',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
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
      }
    ]
  }, */
  {
    divider: true
  },
  {
    title: true,
    name: 'Εφαρμογές',
  },
  {
    name: 'Ρυθμίσεις',
    url: '/settings',
    icon: 'fas fa-tools',
  },
  {
    name: 'Σελίδες',
    url: '/extern',
    icon: 'fa fa-sticky-note',
    children: [
      /* {
        name: 'Σύνδεση Χρήστη',
        url: '/extern/login',
        icon: 'icon-lock'
      }, */
      {
        name: 'Εγγραφή Χρήστη',
        url: '/extern/register',
        icon: 'icon-people'
      }
    ]
  },
  /*  {
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
   } */
];

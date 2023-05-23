export const navigation = [
  {
    name: 'Αρχική Σελίδα',
    url: '/dashboard',
    icon: 'speedometer',
  },
  {
    divider: true,
  },
  {
    name: 'Βιβλιοθήκη',
    url: '/library',
    icon: 'library',

    children: [
      {
        name: 'Χωροθέτηση',
        url: '/library/map', // bookcase, categories
        icon: 'map' // fa-light fa-
      },
      {
        name: 'Βιβλία',
        url: '/library/book',
        icon: 'books'
      },
      {
        name: 'Κατανομή',
        url: '/library/allocation', // authors, publishers, book contents
        icon: 'layer1'
      },
      {
        name: 'Δανεισμός',
        url: '/library/lending', // authors, publishers, book contents
        icon: 'lending'
      },
    ]
  },
  {
    name: 'Αναζήτηση',
    url: '/smartengine',
    icon: 'searchbook',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Αναλυτικά',
    url: '/charts',
    icon: 'pie-chart'
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
    icon: 'tools',
  },
  {
    name: 'Σελίδες',
    url: '/service',
    icon: 'contents',
    children: [
      /* {
        name: 'Σύνδεση Χρήστη',
        url: '/service/login',
        icon: 'icon-lock'
      }, */
      {
        name: 'Εγγραφή Χρήστη',
        url: '/service/register',
        icon: 'signup'
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

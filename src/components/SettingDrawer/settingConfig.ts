import config from '~/config/defaultSettings'
const colorList = [
  {
    key: 'Үндсэн өнгө',
    color: config.primaryColor
  },
  {
    key: 'Улаан',
    color: '#F5222D'
  },
  {
    key: 'Улбар шар',
    color: '#FA541C'
  },
  {
    key: 'Шар',
    color: '#FAAD14'
  },
  {
    key: 'Тод ногоон',
    color: '#13C2C2'
  },
  {
    key: 'Ногоон',
    color: '#42ad0e'
  },
  {
    key: 'Гүн цэнхэр',
    color: '#2F54EB'
  },
  {
    key: 'Ягаан',
    color: '#722ED1'
  },
  {
    key: 'Ягаан',
    color: '#d946ef'
  }
]

const updateDarkMode = isDark => {
  // let styleTag = document.getElementById('themeCss')
  //
  // const app = document.getElementsByTagName('html')
  // const appTag = app[0];
  // // if (!styleTag) {
  // //   styleTag = document.createElement('link')
  // //   styleTag.setAttribute('id', 'themeCss')
  // //   document.head.appendChild(styleTag)
  // // }
  if (isDark) {
    // styleTag.setAttribute('href', '/themes/dark.css')
    // appTag!.className = 'darkMode'
    document.documentElement.classList.add('dark');
  }else{
    // styleTag.setAttribute('href', '')
    // appTag!.className = ''
    document.documentElement.classList.remove('dark');
  }

}

const updateColorWeak = isColorWeak => {
  const app = document.getElementsByTagName('html')
  isColorWeak ? app[0]!.classList.add('colorWeak') : app[0]!.classList.remove('colorWeak')
}

const updateGrayMode = isGrayMode => {
  const app = document.getElementsByTagName('html')

  isGrayMode ? app[0]!.classList.add('grayMode') : app[0]!.classList.remove('grayMode')
}

export { colorList, updateColorWeak, updateGrayMode, updateDarkMode }

import router from '../../utils/navigo'
import './header.css'
export const HeaderRender = (User) => {
  if (User) {
    const header = document.querySelector('header')
    header.innerHTML = ''
    HeaderUsuario()
  } else {
    const header = document.querySelector('header')
    header.innerHTML = ''
    Header()
  }
}

export const Header = () => {
  const header = document.querySelector('header')
  const divtitle = document.createElement('div')
  divtitle.className = 'title-container'
  const title = document.createElement('h1')
  title.innerText = 'FandomFiesta'
  divtitle.append(title)
  const listHeader = document.createElement('ul')
  listHeader.className = 'header'
  listHeader.innerHTML = `
  <li><a href='/inicio' id="inicio-link">Inicio</a></li>
  <li><button id='login-button' data-route='/login'>Entrar ⁄ Registrarse</button></li>
  `
  header.append(divtitle, listHeader)

  const loginButton = listHeader.querySelector('#login-button')
  loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/login')
  })

  const inicioLink = listHeader.querySelector('a[href="/inicio"]')
  inicioLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/inicio')
  })
}

export const HeaderUsuario = () => {
  const header = document.querySelector('header')
  header.innerHTML = ''
  const title = document.createElement('h1')
  title.innerText = 'FandomFiesta'
  const listHeaderUsuario = document.createElement('ul')
  listHeaderUsuario.className = 'header-usuario'
  listHeaderUsuario.innerHTML = `
  <li><a href='/inicio' id='inicio-link'>Inicio</a></li>
  <li><a href="/mis-eventos" id='mis-eventos'>Mis eventos</a></li>
  <li><a href="/perfil" id= 'mi-perfil'>Mi perfil</a></li>
  <li><a class="bye" href="/bye">Cerrar sesión</a></li>
  `

  const inicioLink = listHeaderUsuario.querySelector('#inicio-link')
  inicioLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/inicio')
  })

  const perfilLink = listHeaderUsuario.querySelector('#mi-perfil')
  perfilLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/perfil')
  })

  const eventosLink = listHeaderUsuario.querySelector('#mis-eventos')
  eventosLink.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/mis-eventos')
  })

  const logoutButton = listHeaderUsuario.querySelector('.bye')
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault()
    router.navigate('/bye')
  })

  header.append(title, listHeaderUsuario)
}

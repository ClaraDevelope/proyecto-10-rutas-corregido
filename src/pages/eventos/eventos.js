import { printErrorMessage } from '../../components/errorMessage/errorMessage'
import { formCreateEvent, formEventEdition } from '../../components/forms/forms'
import {
  createEvento,
  deleteEvento,
  editEvento,
  getAsistente,
  getEvento
} from '../../utils/fetch'
import router from '../../utils/navigo'
import { showLoader } from '../../utils/showLoader'
import { usuarioId } from '../../utils/variables'
import './eventos.css'
export const printEventos = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  showLoader(main)
  const eventosContainer = document.createElement('div')
  eventosContainer.className = 'tus-eventos'
  const divContainer = document.createElement('div')
  divContainer.className = 'flex-container'
  const createButton = document.createElement('button')
  createButton.className = 'create-button'
  createButton.innerText = 'Crear nuevo evento'

  createButton.addEventListener('click', formCreateEvent)

  divContainer.append(eventosContainer, createButton)
  main.innerHTML = ''
  main.append(divContainer)

  pintarEvento(eventosContainer)
}

const pintarEvento = async (elementoPadre) => {
  const usuarioData = JSON.parse(localStorage.getItem('user'))
  if (
    usuarioData &&
    usuarioData.eventosOrganizados &&
    usuarioData.eventosOrganizados.length > 0
  ) {
    for (const eventoId of usuarioData.eventosOrganizados) {
      try {
        const evento = await getEvento(eventoId)
        const eventoContainer = document.createElement('div')
        eventoContainer.className = 'evento'
        elementoPadre.append(eventoContainer)
        mostrarEvento(eventoId, eventoContainer)
      } catch (error) {
        console.error('Error al obtener evento:', error)
        const index = usuarioData.eventosOrganizados.indexOf(eventoId)
        if (index !== -1) {
          usuarioData.eventosOrganizados.splice(index, 1)
          localStorage.setItem('user', JSON.stringify(usuarioData))
          elementoPadre.remove()
        }
      }
    }
  } else {
    const mensaje = document.createElement('p')
    mensaje.textContent = 'No tienes eventos organizados.'
    mensaje.style.fontSize = '20px'
    mensaje.style.fontWeight = 'bold'
    elementoPadre.appendChild(mensaje)
  }
}

const mostrarEvento = async (eventoId, elementoPadre) => {
  try {
    const evento = await getEvento(eventoId)
    const titulo = document.createElement('h3')
    const divCartel = document.createElement('div')
    divCartel.className = 'img-container'
    const cartel = document.createElement('img')
    cartel.alt = 'cartel-evento'
    cartel.loading = 'lazy'
    divCartel.append(cartel)
    const info = document.createElement('div')
    info.className = 'info'
    titulo.textContent = evento.titulo
    cartel.src = evento.cartel
    const fecha = new Date(evento.fecha)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const año = fecha.getFullYear()

    const fechaFormateada = `${dia}/${mes}/${año}`

    info.innerHTML = `
      <p class="fecha">${fechaFormateada}</p>
      <p class="ubicacion">${evento.ubicacion}</p>
      <div class='button-container'>
          <button class='asistencia' id='ver-asistentes'>Ver asistentes</button>
          <button class='info-boton' id='editar-evento'>Editar evento</button>
          <button class='eliminar' id='eliminar-evento'>Eliminar</button>
      </div>
    `
    const buttonAsistentes = info.querySelector('#ver-asistentes')
    buttonAsistentes.addEventListener('click', () => {
      eventoId = evento._id
      router.navigate(`/${eventoId}/asistentes`)
    })
    const editarButton = info.querySelector('#editar-evento')
    editarButton.addEventListener('click', () => {
      eventoId = evento._id
      router.navigate(`/${eventoId}/editar`)
    })

    const eliminarButton = info.querySelector('#eliminar-evento')
    eliminarButton.addEventListener('click', async () => {
      const token = localStorage.getItem('token')
      try {
        await deleteEvento(eventoId, token)
        console.log('Evento eliminado correctamente')
        const eventoContainer = document.getElementById(
          `evento-container-${eventoId}`
        )
        if (eventoContainer) {
          eventoContainer.remove()
        }
        alert('Evento eliminado')
      } catch (error) {
        console.error('Error al eliminar el evento:', error)
        const main = document.querySelector('main')
        printErrorMessage(
          main,
          'No se ha podido eliminar el evento. Inténtalo más tarde.'
        )
      }
    })

    elementoPadre.append(titulo, divCartel, info)
  } catch (error) {
    console.error('Error al mostrar evento:', error)
    const usuarioData = JSON.parse(localStorage.getItem('user'))
    const index = usuarioData.eventosOrganizados.indexOf(eventoId)
    if (index !== -1) {
      usuarioData.eventosOrganizados.splice(index, 1)
      localStorage.setItem('user', JSON.stringify(usuarioData))
    }
  }
}

export const verAsistentes = async (evento) => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  console.log(evento)
  let count = 0

  const asistentesContainer = document.createElement('ul')
  asistentesContainer.className = 'asistentes-container'

  for (const asistente of evento.asistentes) {
    try {
      const datosAsistente = await getAsistente(asistente)
      if (datosAsistente && datosAsistente.nombre) {
        const asistenteP = document.createElement('li')
        asistenteP.innerText = datosAsistente.nombre
        asistentesContainer.append(asistenteP)
        count++
      }
    } catch (error) {
      console.error('Error al procesar datos del asistente:', error)
    }
  }

  const numeroAsistentes = document.createElement('span')
  numeroAsistentes.className = 'span'
  numeroAsistentes.innerText = `Total de asistentes: ${count}`
  asistentesContainer.append(numeroAsistentes)

  main.append(asistentesContainer)
}

export const formEditarEventos = (eventoId) => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const formulario = document.createElement('form')
  formulario.id = 'form-evento'
  formulario.innerHTML = formEventEdition
  formulario.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = document.querySelector('#form-evento')
    const formData = new FormData(form)
    const userId = usuarioId
    const token = localStorage.getItem('token')
    try {
      await editEvento(eventoId, userId, formData, token)
      alert('¡Editado con éxito!')
    } catch (error) {
      console.error('Error al editar el evento:', error.message)
    }
  })

  main.append(formulario)
}

export const submitFormEvent = async (userId, formData, form) => {
  const token = localStorage.getItem('token')
  const main = document.querySelector('main')
  main.innerHTML = ''
  showLoader(main)
  try {
    const data = await createEvento(userId, formData, token)
    alert('Evento creado con éxito')
    const evento = await getEvento(data.evento._id)
    if (evento) {
      const usuarioData = JSON.parse(localStorage.getItem('user'))
      usuarioData.eventosOrganizados.push(evento._id)
      localStorage.setItem('user', JSON.stringify(usuarioData))
      printEventos()
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    printErrorMessage(form, 'Error al registrar el evento')
  }
}

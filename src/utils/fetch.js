import { API_URL } from './variables'
import { printErrorMessage } from '../components/errorMessage/errorMessage'
import { actualizarInterfazUsuario } from '../pages/home/main/home'

export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options)
    if (!response.ok) {
      const errorMessage = await response.text()
      console.log(errorMessage)
      printErrorMessage(errorMessage)
    }
    return await response.json()
  } catch (error) {
    console.error('Error en fetchData:', error)
  }
}

export const getEvento = (eventoId) => {
  return fetchData(`/eventos/${eventoId}`)
}

export const deleteEvento = (eventoId, token) => {
  return fetchData(`/eventos/${eventoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const editEvento = (eventoId, userId, formData, token) => {
  return fetchData(`/eventos/${eventoId}/auth/${userId}`, {
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const createEvento = (userId, formData, token) => {
  return fetchData(`/auth/${userId}/create`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAsistente = (asistenteId) => {
  return fetchData(`/asistentes/${asistenteId}`)
}

export const submitFetchAttendee = async (nombre, email, eventoId) => {
  const datos = JSON.stringify({ nombre, email })
  return fetchData(`/asistentes/eventos/${eventoId}/confirmar`, {
    method: 'POST',
    body: datos,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const llamarAsistenteUsuario = async (
  eventoId,
  nombreUsuario,
  email
) => {
  const datos = JSON.stringify({ nombre: nombreUsuario, email: email })
  const opciones = {
    method: 'POST',
    body: datos,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }

  try {
    const response = await fetchData(
      `/auth/eventos/${eventoId}/confirmar`,
      opciones
    )
    if (response && !response.error) {
      console.log(response)
      printSuccessMessage(
        '¡Enhorabuena! Te has inscrito correctamente en el evento'
      )

      const user = JSON.parse(localStorage.getItem('user'))
      user.eventosAsistencia.push(eventoId)
      localStorage.setItem('user', JSON.stringify(user))

      actualizarInterfazUsuario()
    } else if (response && response.error) {
      console.error('Error en la solicitud:', response.error)
      printErrorMessage('Error en la solicitud. Inténtalo de nuevo más tarde.')
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    printErrorMessage('Error en la solicitud. Inténtalo de nuevo más tarde.')
  }
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EventCreate() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: 0,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { api } = await import('../../lib/api.js')
      const payload = {
        title: form.title,
        description: form.description || undefined,
        location: form.location || undefined,
        start_time: form.start_time,
        end_time: form.end_time,
        capacity: Number(form.capacity),
      }
      const created = await api.post('/api/admin/events', payload)
      nav(`/events/${created.id}`)
    } catch (e) {
      setError(e.message || 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>Create Event</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:480}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
        <input placeholder="Location" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} />
        <label>Start Time</label>
        <input type="datetime-local" value={form.start_time} onChange={e=>setForm(f=>({...f,start_time:e.target.value}))} required />
        <label>End Time</label>
        <input type="datetime-local" value={form.end_time} onChange={e=>setForm(f=>({...f,end_time:e.target.value}))} required />
        <input placeholder="Capacity" type="number" min="0" value={form.capacity} onChange={e=>setForm(f=>({...f,capacity:e.target.value}))} required />
        <button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  )
}

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhotoUploadForm } from '@/components/photo/photo-upload-form'
import { PHOTO_CATEGORIES } from '@/lib/photo-constants'

// Mock the photo constants
jest.mock('@/lib/photo-constants', () => ({
  PHOTO_CATEGORIES: [
    { value: 'SELFIE', label: '自拍' },
    { value: 'DAILY', label: '日常' },
    { value: 'PORTRAIT', label: '人像' },
    { value: 'LANDSCAPE', label: '风景' },
    { value: 'ART', label: '艺术' },
  ],
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('PhotoUploadForm', () => {
  const mockOnSuccess = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, message: 'Success' }),
    })
  })

  it('renders upload form correctly', () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByText('上传照片')).toBeInTheDocument()
    expect(screen.getByLabelText('选择照片文件')).toBeInTheDocument()
    expect(screen.getByLabelText('标题')).toBeInTheDocument()
    expect(screen.getByLabelText('描述')).toBeInTheDocument()
    expect(screen.getByLabelText('分类')).toBeInTheDocument()
    expect(screen.getByText('上传')).toBeInTheDocument()
    expect(screen.getByText('取消')).toBeInTheDocument()
  })

  it('displays all photo categories in select', () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const categorySelect = screen.getByLabelText('分类')
    expect(categorySelect).toBeInTheDocument()

    // Check if all categories are present
    PHOTO_CATEGORIES.forEach(category => {
      expect(screen.getByText(category.label)).toBeInTheDocument()
    })
  })

  it('handles file selection', async () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const fileInput = screen.getByLabelText('选择照片文件')
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(fileInput.files[0]).toBe(file)
      expect(fileInput.files).toHaveLength(1)
    })
  })

  it('validates required fields', async () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const uploadButton = screen.getByText('上传')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('请选择照片文件')).toBeInTheDocument()
    })
  })

  it('handles form submission successfully', async () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    // Fill form
    const fileInput = screen.getByLabelText('选择照片文件')
    const titleInput = screen.getByLabelText('标题')
    const descriptionInput = screen.getByLabelText('描述')
    const categorySelect = screen.getByLabelText('分类')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.change(titleInput, { target: { value: 'Test Photo' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })
    fireEvent.change(categorySelect, { target: { value: 'LANDSCAPE' } })

    // Submit form
    const uploadButton = screen.getByText('上传')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/photos', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }))
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('handles upload error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Upload failed' }),
    })

    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    // Fill form
    const fileInput = screen.getByLabelText('选择照片文件')
    const titleInput = screen.getByLabelText('标题')
    const categorySelect = screen.getByLabelText('分类')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.change(titleInput, { target: { value: 'Test Photo' } })
    fireEvent.change(categorySelect, { target: { value: 'LANDSCAPE' } })

    // Submit form
    const uploadButton = screen.getByText('上传')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('上传失败，请重试')).toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const cancelButton = screen.getByText('取消')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('disables upload button during submission', async () => {
    // Mock a slow response
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1 })
        }), 100)
      )
    )

    render(
      <PhotoUploadForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    // Fill form
    const fileInput = screen.getByLabelText('选择照片文件')
    const titleInput = screen.getByLabelText('标题')
    const categorySelect = screen.getByLabelText('分类')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.change(titleInput, { target: { value: 'Test Photo' } })
    fireEvent.change(categorySelect, { target: { value: 'LANDSCAPE' } })

    // Submit form
    const uploadButton = screen.getByText('上传')
    fireEvent.click(uploadButton)

    // Button should be disabled during upload
    expect(uploadButton).toBeDisabled()
    expect(screen.getByText('上传中...')).toBeInTheDocument()

    // Wait for upload to complete
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
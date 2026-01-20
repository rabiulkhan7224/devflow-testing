const mockToast=jest.fn()
const mockUseToast =jest.fn(()=>({
    toast:mockToast,
    toasts:[],
    dismiss:jest.fn(),
}))

export {mockUseToast, mockToast}
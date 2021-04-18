export interface PostAppointParams {
    store_id: number
    location_id: number
    customer_id: number
    type: string
    is_voided: boolean
    delivery_method: string
    customer_email: string
    customer_first_name: string
    customer_last_name: string
    customer_phone: string
    customer_address_1: string
    customer_address_2: string
    customer_city: string
    customer_state: string
    customer_postcode: string
    customer_country: string
    customer_note: string | null
    customer_contact_method: string
    repairs: any[]
    booking_date: string
    selected_date: string
    selected_start_time: string | null
    selected_end_time: string | null
}

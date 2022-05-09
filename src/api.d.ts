declare type ActionData = {
  id: number
  user_id: number
  item_name: string
  color: string
}

declare type LoggingData = {
  id: number
  user_id: number
  item_name: string
  color: string
  start_time: string
  finish_time?: string
}

declare type LogedData = {
  id: number
  user_id: number
  item_name: string
  color: string
  start_time: string
  finish_time: string
}

declare type ChartLogedData = {
  id?: number
  item_name: string
  color: string
  start_time: Date
  finish_time: Date
}

declare type ChartTotalLogedData = {
  id?: number
  item_name: string
  color: string
  time: number
}

declare type LoginData = {
  auth?: boolean
  token?: string
  message?: string
}

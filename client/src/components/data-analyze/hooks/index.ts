import { IDataAnalyzeProps } from '../types'
import { watchEffect } from 'vue'

export const useDataAnalyze = (props: IDataAnalyzeProps) => {
    watchEffect(() => {})
    return {}
}

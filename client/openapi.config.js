import { generateService } from '@umijs/openapi'

generateService({
    requestLibPath: "import ryRequest from '../services'",
    schemaPath: 'http://localhost:3000/swagger-json',
    serversPath: './src'
})

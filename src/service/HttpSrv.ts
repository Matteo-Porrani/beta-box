import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://dummyjson.com';

interface ApiError {
    message: string;
    status: number;
    data?: any;
}

export class HttpSrv {
    private readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private handleError(error: AxiosError): never {
        const apiError: ApiError = {
            message: 'An error occurred',
            status: 500,
            data: error.response?.data
        };

        if (error.response) {
            apiError.status = error.response.status;
            switch (error.response.status) {
                case 400:
                    apiError.message = 'Bad Request - Please check your input';
                    break;
                case 401:
                    apiError.message = 'Unauthorized - Please login again';
                    break;
                case 403:
                    apiError.message = 'Forbidden - You don\'t have permission';
                    break;
                case 404:
                    apiError.message = 'Not Found - The requested resource doesn\'t exist';
                    break;
                case 422:
                    apiError.message = 'Validation Error';
                    break;
                case 429:
                    apiError.message = 'Too Many Requests - Please try again later';
                    break;
                case 500:
                    apiError.message = 'Server Error - Please try again later';
                    break;
                default:
                    apiError.message = `Error ${error.response.status} - Please try again later`;
            }
        } else if (error.request) {
            apiError.message = 'Network Error - Please check your connection';
        }

        throw apiError;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.get(url, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.api.post(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    }
}

// Create and export a default instance
export const httpSrv = new HttpSrv();

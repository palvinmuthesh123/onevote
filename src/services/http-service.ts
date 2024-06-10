import axios, { AxiosResponse, AxiosError } from 'axios';
import { fetchData } from './asyncStorage';

export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export class HttpClient<T> {
  private apiUrl: string
  private baseUrl: string = 'https://vcampaign.azurewebsites.net/v1/api'

  constructor(serviceRoute: string) {
    this.apiUrl = this.baseUrl + serviceRoute
  }

  async get(path: string, data: T): Promise<T[]> {
    try {
      const token = await fetchData('token')
      console.log('token ', token)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const response: AxiosResponse<T[]> = await axios.get<T[]>(`${this.apiUrl}/${path}`, { data: data, headers: headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getOne(path: string, id: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get<T>(`${this.apiUrl}/${path}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post(path: string, data: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post<T>(`${this.apiUrl}/${path}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postAuth(path: string, data) {
    try {
      const token = await fetchData('token')
      console.log('token ', token, data)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const response = await axios.post(`${this.apiUrl}/${path}`, data, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postAuthFormdata(path: string, data) {
    try {
      const token = await fetchData('token')
      console.log('token ', token)
      const formdata = new FormData();
      formdata.append('profilePic', data?.data);
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
      console.log(formdata);
      const response = await axios.post(`${this.apiUrl}/${path}`, formdata, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async postAuthFormdatas(path: string, data) {
    try {
      delete data['id']
      var datas = {
        name: data.data.name,
        type: data.data.type,
        uri: data.data.uri
      }
      const token = await fetchData('token')
      console.log('token ', datas, token)
      const formdata = new FormData();
      formdata.append('attachment', datas);
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
      console.log(formdata);
      const response = await axios.post(`${this.apiUrl}/${path}`, formdata, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async update(path: string, id: string, data: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put<T>(`${this.apiUrl}/${path}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(path: string, id: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${path}/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      console.error('Request failed with status code', error.response.status);
    } else if (error.request) {
      console.error('Request failed:', error.request);
    } else {
      console.error('Request failed:', error.message);
    }
  }
}
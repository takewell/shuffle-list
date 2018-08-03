export default class FetchAPI {

  constructor(url, apiToken) {
    this.url = url;
    this.apiToken = apiToken;
  }

  async get(query = '/') {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const headers = this.headers(this.apiToken);
      const res = await fetch(this.url + query, { method: 'GET', headers: headers });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async post(body) {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const res = await fetch(this.url, { method: 'POST', headers: this.headers(this.apiToken), body: JSON.stringify(body) });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async postForm(body) {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const res = await fetch(this.url, { method: 'POST', headers: this.formHeader(this.apiToken), body: body });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async put(body) {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const res = await fetch(this.url, { method: 'PUT', headers: this.headers(this.apiToken), body: JSON.stringify(body) });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async putForm(body) {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const res = await fetch(this.url, { method: 'PUT', headers: this.formHeader(this.apiToken), body: body });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async delete(body) {
    try {
      if (!this.apiToken) return { message: 'not apiToken' };
      const res = await fetch(this.url, { method: 'DELETE', headers: this.headers(this.apiToken), body: JSON.stringify(body) });
      return await res.json();
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  headers(apiToken) {
    return {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  formHeader(apiToken) {
    return {
      Authorization: `Bearer ${apiToken}`
    };
  }

};
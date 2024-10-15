`GET /api/family`

Returns id of user family

---

`PUT /api/family/update`

Accept an object as a body with two params, `familyId` and `name`:

```
body: {
    familyId: string,
    name: string,
}
```

---

`POST /api/family/create`

Accept object with only one param: `body`

```
body: {
    name: string
}
```

---
# WalletFox API Specifcation
Documentation for the WalletFox Platform API.

## Using this documentation
- PATCH requests
  - Not all model parameters are required in the request body, only the values you wish to update.
- Dates
  - All dates are integer values represting the number of milliseconds between 1 January 1970 00:00:00 UTC and the given date. eg: 
  ``` 823230245000 ```

### Common Response Codes
  - 200
  - 201
    - Successfully created content. No content response, however the response header **Location** is provided with the URI location of the created content.  
  - 204
    - Successful delete operation, no content response.
  - 400
    - Bad request, the parameters provided are either not following the specified format (type) or there are some required request parameters that are missing in the request. Returns a json object of the missing parameter(s). Example:
    ```
      {
          "missingParameters": {
              "body": [
                  "email",
                  "name"
              ],
              "path": [
                "userId"
              ]
          }
      }
    ```
  - 401
    - Unauthorised. Returns error code 'bad token' if the provided token could not be verified. Returns 'unauthorised' if the token is okay but the user does not have access to that resource.
  - 404
    - The requested resource could not be found.
  - 500
    - Nothing was wrong with the request, however, there was a server error with the back-end application.

### Authentication
This api uses JSON Web Tokens (JWT) which will be referred to as 'token' within the request/response body parameters.


# /auth
  ### ***GET***
**Summary:** Authenticate an existing user

**Description:** Takes a user's id and password and if correct, returns a Json Web Token which can be used for authentication on specific api methods.

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | body | The user's unique ID | Yes | integer |
| password | body | The user's password | Yes | string |
| token | body | Authentication token | Yes | string

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | Ok |
| **response body**<br><code> token : string </code>
| 400 | Bad Request |
| 500 | Server error |

# auth/google-response
  ### ***GET***

  **Description:** Create a user account by logging in with a google account. The created user will have a googleUserId property set with the user's authenticated id. Usually used as a response from a redirect to the google login.
  
  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | code | query | Google's authentication code | Yes | string

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Ok |
  | **response body**<br><code> token : string </code>
  | 400 | Bad Request |
  | 500 | Server error |

# auth/google
  ### ***GET***

  **Summary:** Login to an existing user with a google token
  **Description:** Provide the platform with a google authentication token and returns an authorisation token for the platform.
  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | code | query | Google's authentication token | Yes | string
  | id | body | The user's id  | Yes | integer
  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Ok |
  | **response body**<br><code> token : string </code>
  | 400 | Bad Request |
  | 500 | Server error |

# /users/{userId}
  ### ***GET***
  **Summary:** Get a user by ID

  **Description:** Get a specific user from the API by specifying the user's ID and providing an access token. If the token shows that this is the user's own data it will return:
  ```
  {
    userId: string,
    userName: string,
    profileURL: string,
    email: string,
    googleUserId: string,
  }
  ```
  Otherwise, the API will not return the user's email as this is private information.

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | userId | path | The targeted user's ID | Yes | integer |
  | token | body | Authentication token | Yes | string

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Ok |
  | **response body**<br><code> userId: integer <br> userName: string <br> profileURL: string <br> email: string <br> googleUserId: string <br> </code> |
  | 401 | Insufficient permissions to access this user, i.e. not logged in |
  | 400 | Bad Request |
  | 404 | User not found |
  | 500 | Server error |

  ### ***PATCH*** // revise
  **Summary:** Update a user's information

  **Description:** Update a specific user's information by supplying the user id in the request path, and by supplying the updated values in the request body.

  If the client would like access to upload an image to the storage as a service, they must supply the requiestImageUpload boolean as true. This will result in a response body with the Amazon Web Services Storage credentials. 

  **Not all model parameters are required in the request body, only the values you wish to update.**

  **Permission:** The supplied token must match the user that is being updated. 

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | userId | path | The user's unique ID | Yes | integer |
  | token | body | Authentication token | Yes | string |
  | email | body | The user's new email | No | string |
  | password | body | The user's new password | No | string |
  | imageURL | body | The user's image URL | No | string |
  | requestImageUpload | body | If the user wants the image upload credentials | No | boolean |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Updated |
  | 200 | Updated, aws credentials: |
  | **response body:** |<code> AccessKeyId: string,<br>SecretAccessKey: string, <br>SessionToken: string, <br>Expiration: string <br> </code>
  | 400 | Bad Request |
  | 401 | Insufficient permissions to update this user |
  | 404 | User not found |
  | 500 | Server error |

  ### ***DELETE***
**Summary:** Delete a user

**Description:** Delete a user from the database

Automatically deletes all the specified user's data except the user id and isActive. isActive is set to false. This is so that the user can still be referenced historically but still have their data removed from the platform.


**Permissions:** Only the authenticated user can delete themself. 


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path | The user's unique id | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 200 | User with id {userId} was deleted |
| 400 | Bad Request |
| 401 | Insufficient permissions to delete this user |
| 404 | User not found |
| 500 | Server error |

# /users
  ### ***GET***
  **Summary:** Search through users resource

  **Description:** By passing in the appropriate options, you can search for a specific user or group of users. 

  For example, if you wish to find all users in a wallet you can put the walletId in the request parameters.

  **Permissions:** Anyone can request to see the users, however, this does not return the user's email or password.

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | name | query | Search by the user's name | No | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Array of search results matching criteria, returns an empty array if none found |
  | **response body**<br><code> [<br>{ <br> userId: string <br> name: string <br> profileURL: string <br> googleUserId <br> }, ... <br>] </code> |
  | 400 | Bad Request |
  | 500 | Server error |

  ### ***POST***
**Summary:** Create a user

**Description:** Creates a new user on the database


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body | The user's email | Yes | string |
| password | body | The user's password | Yes | string |
| name | body | The user's name | Yes | string |
| imageURL | body | The user's uploaded profile image | No | string
**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | User created |
|**response body:** | <code>token: string</code>
| 400 | Bad Request |
| 500 | Server error |

# /wallets
  ### ***GET***
  **Summary:** Get all the wallets that the user is a member of

  **Description:** Retrieves all the wallets  where that the authenticated user is a member of. 


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | token | body | Authentication token | Yes | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Array of wallets matching criteria, returns empty if none found |
  | **response body**<br><code> [<br>{ <br> walletId: integer <br> currency: string <br> name: string <br> }, ... <br>] </code> |
  | 400 | Bad Request |
  | 401 | Not authenticated |
  | 500 | Server error |

  ### ***POST***
**Summary:** Create a new wallet

**Description:** Adds a new wallet to the database and automatically creates the wallet member relation for the user. The wallet member is automatically a wallet admin.

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | body | Authentication token | Yes | string |
| name | body | Wallet's name | Yes | string |
| currency | body | The Wallet's currency | Yes | string |


**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Wallet created |
|**response body:** | <code>walletMemberId: integer <br> userId: integer <br> walletId: integer</code>
| 400 | Bad Request |
| 401 | Not authenticated |
| 500 | Server error |

# /wallets/{walletId}
  ### ***GET***
  **Summary:** Get a wallet by ID

  **Description:** Get a specific wallet from the database by specifying the wallet's ID. The user must be authenticated, as the wallet will only be returned if they are a wallet member. If they are not a wallet member, it will return a 404.

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | path | The wallet's unique ID | Yes | integer |
  | token | body | Authentication token | Yes | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | OK | 
  | **response body:** | <code> walletId: integer <br> name: string <br> currency: string </code>
  | 401 | Unauthorised |
  | 404 | Wallet not found |
  | 500 | Server error |

  ### ***PATCH***
  **Summary:** Update a wallet's information

  **Description:** Update a specific wallet's information by supplying the wallet id in the request path, and by supplying the updated values in the request body.

  Only a wallet member may change a wallet's information.


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | path | The wallet's unique ID | Yes | integer |
  | token | body | Authentication token | Yes | string |
  | name | body | Wallet's name | No | string |
  | currency | body | The Wallet's currency | No | string |
  
  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 204 | Updated, no content |
  | 400 | Bad Request |
  | 401 | Insufficient permissions to edit this wallet, make sure you are an admin. |
  | 404 | Wallet not found |
  | 500 | Server error |

  ### ***DELETE***
**Summary:** Delete a wallet

**Description:** Delete the specified wallet including all associated wallet members. Only a wallet member may delete a wallet.


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| walletId | path | The ID of the wallet to be deleted | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Wallet deleted, no content |
| 400 | Bad Request |
| 401 | Insufficient permissions to delete this wallet |
| 404 | Wallet not found |
| 500 | Server error |

# /wallet-members
  
  ### ***POST***
**Summary:** Adds a wallet member

**Description:** Adds an existing user to a specific wallet. Wallet Members can create new wallet members.


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | body | The user id to be added as a wallet member | Yes | integer |
| token | body | Authentication token | Yes | string |
| walletId | body | The id of the wallet that the user is added to | Yes | integer |

**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Wallet member created |
| 400 | Bad Request |
| 401 | Unauthorised |
| 409 | This user is already a member of this wallet |
| 500 | Server error |

# /wallet-members/{walletMemberId}
  ### ***GET***
  **Summary:** Get a wallet member

  **Description:** Get a specific wallet member by providing the wallet member id in the path

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletMemberId | Path | The unique wallet member id | Yes | integer |


  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Returns the found wallet member |
  | **response body:** | <code> walletMemberId: integer <br> userId: integer <br> walletId: integer </code>
  | 400 | Bad Request |
  | 500 | Server error |



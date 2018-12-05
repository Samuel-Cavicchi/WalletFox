# WalletFox API Specifcation
Documentation for the WalletFox Platform API.

## Using this documentation
- PATCH requests
  - Not all model parameters are required in the request body, only the values you wish to update.


### Common Response Codes
  - 200
  - 201
    - Successfully created content. No content response, however the response header **Location** is provided with the URI location of the created content.  
  - 204
    - Successful delete operation, no content response.
  - 400
    - Bad request, the parameters provided are either not following the specified format (type) or there are some required request parameters that are missing in the request. Returns a json object of the incorrect parameter(s). Example:
    ```
    {
      [
        userId,
        email,
        walletId...
      ]
    }
    ```
  - 404
    - The requested resource could not be found
  - 500
    - Nothing was wrong with the request, however, there was a server error with the back-end application.

### Authentication
This api uses JSON Web Tokens (JWT) which will be referred to as 'tokens' within the request body parameters.


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

# /users/{userId}
  ### ***GET***
  **Summary:** Get a user by ID

  **Description:** Get a specific user from the API by specifying the user's ID and providing an access token. If the token shows that this is the user's own data it will return:
  ```
  {
    userId: string
    userName: string
    profileURL: string
    email: string
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
  | **response body**<br><code> userId: string <br> userName: string <br> profileURL: string <br> email: string <br>  </code> |
  | 401 | Insufficient permissions to access this user, i.e. not logged in |
  | 400 | Bad Request |
  | 404 | User not found |
  | 500 | Server error |

  ### ***PATCH***
  **Summary:** Update a user's information

  **Description:** Update a specific user's information by supplying the user id in the request path, and by supplying the updated values in the request body.

  **Not all model parameters are required in the request body, only the values you wish to update.**


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | userId | path | The user's unique ID | Yes | integer |
  | token | body | Authentication token | Yes | string |
  | email | body | The user's new email | No | string |
  | password | body | The user's new password | No | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Updated, new password |
  | **response body:** |<code> token: string</code>
  | 204 | Updated, no content |
  | 400 | Bad Request |
  | 401 | Insufficient permissions to update this user |
  | 404 | User not found |
  | 500 | Server error |

  ### ***DELETE***
**Summary:** Delete a user

**Description:** Delete a user from the database

Automatically deletes all the specified user's data except the user id and isActive. isActive is set to false. This is so that the user can still be referenced historically but still have their data removed from the platform.


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path | The user's unique id | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Deleted, no content |
| 400 | Bad Request |
| 401 | Insufficient permissions to delete this user |
| 404 | User not found |
| 500 | Server error |

# /users
  ### ***GET***
  **Summary:** Search through users resource

  **Description:** By passing in the appropriate options, you can search for a specific user or group of users. 

  For example, if you wish to find all users in a wallet you can put the walletId in the request parameters.

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | userName | query | Search by the user's name | No | string |
  | walletId | query | Search by the wallet and return wallet members as user id | No | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Array of search results matching criteria, returns an empty array if none found |
  | **response body**<br><code> [<br>{ <br> userId: string <br> userName: string <br> profileURL: string <br> }, ... <br>] </code> |
  | 400 | Bad Request |
  | 500 | Server error |

  ### ***POST***
**Summary:** Create a user

**Description:** Creates a new user on the database

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

  **Description:** Gets all the wallets as an array where the user has a member relation with the wallet id.


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

**Description:** Adds a new wallet to the database and automatically creates the wallet member relation for the user.

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | body | Authentication token | Yes | string |


**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Wallet created |
| 400 | Bad Request |
| 401 | Not authenticated |
| 500 | Server error |

# /wallets/{walletId}
  ### ***GET***
  **Summary:** Get a wallet by ID

  **Description:** Get a specific wallet from the database by specifying the wallet's ID

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
  | 401 | Not a member of this wallet or not logged in|
  | 404 | Wallet does not exist |
  | 500 | Server error |

  ### ***PATCH***
  **Summary:** Update a wallet's information

  **Description:** Update a specific wallet's information by supplying the wallet id in the request path, and by supplying the updated values in the request body.

  **Not all model parameters are required in the request body, only the values you wish to update.**

  Only a wallet member who is admin may change a wallet's information


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | path | The wallet's unique ID | Yes | integer |
  | token | body | Authentication token | Yes | string |

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

**Description:** Delete the specified wallet including all associated wallet members, payments, payment debts and wallet debts. Only a wallet member with admin privileges can delete a wallet.


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

# /payment-debts
  ### ***GET***
  **Summary:** Search through payment debts

  **Description:** Search for payment debts by passing through the correct search parameters

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | query | The id of the wallet in which the payment was made | No | string |
  | userOwing | query | The user id who owes in the payment debts | No | string |
  | payee | query | The user id of the user who will be paid by the payment debts | No | string |
  | token | body | Authentication token | Yes | string |


  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Array of all payment debts matching criteria, returns empty if none found |
  | **response body**<br><code> [<br>{ <br> paymentDebtId: integer <br> userOwingId: integer <br> paymentId: integer <br> amount: integer <br> }, ... <br>] </code> |
  | 400 | Bad Request |
  | 401 | User not logged in |
  | 500 | Server error |

  ### ***POST***
**Summary:** Create a new payment debt

**Description:** Adds a new payment debt to an existing payment

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | body | Authentication token | Yes | string |
| paymentId | body | The ID of the payment | Yes | integer |
| amount | body | The amount of the debt | Yes | integer |
| userOwingId | body | The ID of the user who owes this debt | Yes | integer |
**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Payment created |
| 400 | Bad request |
| 401 | Unauthorised |
| 500 | Server error |

# /payment-debts/{paymentDebtId}
  ### ***DELETE***
  **Summary:** Delete a payment debt

  **Description:** Deletes a specific payment debt from a payment.
  Only the payment payee can delete the corresponding payment debt


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | paymentDebtId | path | The payment debt id of the debt to be deleted | Yes | integer |
  | token | body | Authentication token | Yes | string |


  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 204 | Payment debt deleted, no content |
  | 400 | Bad Request |
  | 401 | Unauthorized |
  | 404 | Payment debt not found |
  | 500 | Server error |

  ### ***PATCH***
**Summary:** Update a payment debt

**Description:** Update a specific payment debt's information on a payment by supplying the debt id in the request path, and by supplying the updated values in the request body.

**Not all model parameters are required in the request body, only the values you wish to update.**

Only the payment payee can delete the corresponding payment debt


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| paymentDebtId | path | The payment id of the payment to be deleted | Yes | integer |
| token | body | Authentication token | Yes | string |
| amount | body | The amount of the debt | No | integer |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Payment updated, no content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Payment not found |
| 500 | Server error |

# /payments
  ### ***GET***
  **Summary:** Search through payments

  **Description:** Search for payments by passing through the correct search parameters

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | query | The id of the wallet in which the payment was made | No | string |
  | payee | query | The user id of the user who made the payment | No | string |
  | token | body | Authentication token | Yes | string |


  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Array of all payments matching criteria, returns empty if none found |
  | 400 | Bad Request |
  | 401 | Unauthorized |
  | 404 | Payment not found |
  | 500 | Server error |

  ### ***POST***
**Summary:** Create a new payment

**Description:** Adds a new payment to a specified wallet.

The front-end application will create the corresponding payment debts, as the payment does not hold any money values. If the front-end application fails to do this, the payment will be ignored when creating wallet-debts through /wallet-debts POST method. 

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| walletId | query | The id of the wallet in which the payment was made | No | string |
| payee | body | The user id of the user who made the payment | No | string |
| token | body | Authentication token | Yes | string |
| description | body | Payment Description | Yes | string |
| paymentdate | body | Payment Date | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Payment created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 500 | Server error |

# /payments/{paymentId}
  ### ***DELETE***
**Summary:** Delete a payment

**Description:** Deletes a specific payment from a wallet. Only the payee can initiate this request


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| paymentId | path | The payment id of the payment to be deleted | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Payment deleted, no content |
| 400 | Bad Request |
| 401 | Unauthorised |
| 404 | Payment not found |
| 500 | Server error |

  ### ***PATCH***
**Summary:** Update a payment

**Description:** Update a specific payment's information by supplying the payment id in the request path, and by supplying the updated values in the request body.

**Not all model parameters are required in the request body, only the values you wish to update.**

Only the payee can initiate this request


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| paymentId | path | The payment id of the payment to be updated | Yes | integer |
| payee | body | The user id of the user who made the payment | No | string |
| token | body | Authentication token | Yes | string |
| description | body | Payment Description | No | string |
| paymentdate | body | Payment Date | No | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Payment updated, no content |
| 400 | Bad Request |
| 401 | Unauthorised |
| 404 | Payment not found |
| 500 | Server error |

# /wallet-debts
  ### ***GET***
  **Summary:** Search through wallet debts

  **Description:** Search through all wallet debts given the correct search parameters


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | query | Find the wallet-debts for the specified wallet id  | No | integer |
  | userId | query | Find the wallet-debts where the user is involved in the transaction  | No | integer |
  | token | body | Authentication token | Yes | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Returns an array of all wallet-debts matching the criteria supplied, returns empty if none found |
  | 401 | Unauthorised |
  | 400 | Bad Request |
  | 500 | Server error |

  ### ***POST***
**Summary:** Generate wallet debts

**Description:** Tells the back end api to generate all wallet debts for all outstanding payments and payment debts for this wallet, returns a JSON array of the generated result

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| walletId | query | The wallet id that we want to generate wallet debts for | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Debts created |
| 204 | Valid request but no wallet debts were created because no payments could be found |
| 400 | Bad Request |
| 401 | Unauthorised |
| 404 | Wallet not found |
| 500 | Server error |

# /wallet-debts/{walletDebtId}
  ### ***PATCH***
**Summary:** Update a wallet debt

**Description:** Updates a specific wallet debt from a wallet by supplying the wallet debt id in the request path, and by supplying the updated values in the request body.

**Not all model parameters are required in the request body, only the values you wish to update.**

Only the userToBePaid can update the wallet debt value / mark it has paid


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| walletDebtId | path | The wallet debt id of the payment to be updated | Yes | integer |
| token | body | Authentication token | Yes | string |
| isPaid | body | True if the wallet debt has been paid for | No | boolean


**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Debt updated updated, no content |
| 400 | Bad Request |
| 401 | Unauthorised |
| 404 | Wallet Debt not found |
| 500 | Server error |

# /wallet-members
  ### ***GET***
  **Summary:** Search through wallet members

  **Description:** Search through all wallet members given the correct search parameters, and return a select few results

  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletId | query | Find the wallet members for the specified wallet id  | No | integer |
  | userId | query | Find the wallet members for the specified user id  | No | integer |
  | token | body | Authentication token | Yes | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 200 | Returns an array of all wallet members matching the criteria supplied, returns empty if none found |
  | 400 | Bad Request |
  | 401 | Unauthorised |
  | 500 | Server error |

  ### ***POST***
**Summary:** Adds a wallet member

**Description:** Adds an existing user to a specific wallet. Wallet Members can create new wallet members, only wallet member admins can create new wallet member admins.


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | query | The user id to be added as a wallet member | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 201 | Wallet member created |
| 400 | Bad Request |
| 401 | Unauthorised |
| 409 | This user is already a member of this wallet |
| 500 | Server error |

# /wallet-members/{walletMemberId}
  ### ***PATCH***
  **Summary:** Update a wallet member

  **Description:** Updates a wallet member, usually used to create a wallet admin or remove admin privileges.

  Only a current wallet member with admin privileges can patch wallet members


  **Parameters**

  | Name | Located in | Description | Required | Schema |
  | ---- | ---------- | ----------- | -------- | ---- |
  | walletMemberId | path | The wallet member id | Yes | integer |
  | token | body | Authentication token | Yes | string |

  **Responses**

  | Code | Description |
  | ---- | ----------- |
  | 204 | Debt updated updated, no content |
  | 400 | Bad Request |
  | 401 | Unauthorised |
  | 404 | Wallet Debt not found |
  | 500 | Server error |

  ### ***DELETE***
**Summary:** Remove a user from a wallet

**Description:** Delete a wallet member. If this member is the last of the wallet members, the wallet will be automatically deleted. Only the user can delete themselves, however wallet member admins can delete other wallet members.


**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| walletMemberId | path | The wallet member's unique ID | Yes | integer |
| token | body | Authentication token | Yes | string |

**Responses**

| Code | Description |
| ---- | ----------- |
| 204 | Deleted, no content |
| 400 | Bad Request |
| 401 | Unauthorised |
| 404 | Wallet member not found |
| 500 | Server error |

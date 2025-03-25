# Tetra Fund!

## Project structure

The `/backend` folder contains the Rust smart contract:

- `Cargo.toml`, which defines the crate that will form the backend
- `lib.rs`, which contains the actual smart contract, and exports its interface

The `/frontend` folder contains web assets for the application's user interface. The user interface is written with plain JavaScript, but any frontend framework can be used.

## ICP Transfer Testing

### Step 1: Setup project environment

Start a local instance of the replica and create a new project with the commands:

```
dfx start --background
```

### Step 2: Determine ledger file locations

> [!TIP]
> You can read more about how to [setup the ICP ledger locally](https://internetcomputer.org/docs/current/developer-docs/defi/icp-tokens/ledger-local-setup).

Go to the [releases overview](https://dashboard.internetcomputer.org/releases) and copy the latest replica binary revision.

The URL for the ledger Wasm module is `https://download.dfinity.systems/ic/<REVISION>/canisters/ledger-canister.wasm.gz`.

The URL for the ledger.did file is `https://raw.githubusercontent.com/dfinity/ic/<REVISION>/rs/rosetta-api/icp_ledger/ledger.did`.

[OPTIONAL]
If you want to make sure you have the latest ICP ledger files, you can run the following script. Please ensure that you have [`jq`](https://jqlang.github.io/jq/) installed as the script relies on it.

```sh
curl -o download_latest_icp_ledger.sh "https://raw.githubusercontent.com/dfinity/ic/1f1d8dd8c294d19a5551a022e3f00f25da7dc944/rs/rosetta-api/scripts/download_latest_icp_ledger.sh"
chmod +x download_latest_icp_ledger.sh
./download_latest_icp_ledger.sh
```

### Step 3: Create a new identity that will work as a minting account

```bash
dfx identity new minter --storage-mode plaintext
dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
```

> [!IMPORTANT]
> Transfers from the minting account will create Mint transactions. Transfers to the minting account will create Burn transactions.

### Step 4: Switch back to your default identity and record its ledger account identifier

```bash
dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
```

### Step 5: Deploy the ledger canister to your network

Take a moment to read the details of the call made below. Not only are you deploying the ICP ledger canister, you are also:

-   Deploying the canister to the same canister ID as the mainnet ledger canister. This is to make it easier to switch between local and mainnet deployments and set in `dfx.json` using `specified_id`.
-   Setting the minting account to the account identifier you saved in a previous step (MINTER_ACCOUNT_ID).
-   Minting 100 ICP tokens to the DEFAULT_ACCOUNT_ID (1 ICP is equal to 10^8 e8s, hence the name).
-   Setting the transfer fee to 0.0001 ICP.
-   Naming the token Local ICP / LICP

```bash
dfx deploy icp_ledger_canister --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = 10_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt \"LICP\";
      token_name = opt \"Local ICP\";
    }
  })
"
```

If successful, the output should be:

```bash
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    icp_ledger_canister: http://127.0.0.1:4943/?canisterId=bnz7o-iuaaa-aaaaa-qaaaa-cai&id=ryjl3-tyaaa-aaaaa-aaaba-cai
```

### Step 6: Verify that the ledger canister is healthy and working as expected

```bash
dfx canister call icp_ledger_canister account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$DEFAULT_ACCOUNT_ID'")]) + "}")')'})'
```

The output should be:

```bash
(record { e8s = 10_000_000_000 : nat64 })
```

### Step 7: Deploy the token transfer canister

```bash
dfx deploy
```

### Step 8: Determine out the address of your canister

```bash
TOKENS_TRANSFER_ACCOUNT_ID="$(dfx ledger account-id --of-canister backend)"
TOKENS_TRANSFER_ACCOUNT_ID_BYTES="$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$TOKENS_TRANSFER_ACCOUNT_ID'")]) + "}")')"
```

### Step 9: Transfer funds to your canister

> [!TIP]
> Make sure that you are using the default `dfx` account that we minted tokens to in step 6 for the following steps.

Make the following call to transfer funds to the canister:

```bash
dfx canister call icp_ledger_canister transfer "(record { to = ${TOKENS_TRANSFER_ACCOUNT_ID_BYTES}; memo = 1; amount = record { e8s = 2_00_000_000 }; fee = record { e8s = 10_000 }; })"
```

If successful, the output should be:

```bash
(variant { Ok = 1 : nat64 })
```

### Step 10: Transfer funds from the canister

Now that the canister owns ICP on the ledger, you can transfer funds from the canister to another account, in this case back to the default account:

```bash
dfx canister call backend transfer "(record { amount = record { e8s = 1_00_000_000 }; to_principal = principal \"$(dfx identity get-principal)\"})"
```

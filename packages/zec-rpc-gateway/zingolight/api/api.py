from flask import request, jsonify
from jsonrpcclient import request as request_rpc
import requests
import uuid
import time

from . import bp as api

from ..docker_manager import client, wait_for_container, get_container_uri, get_containers_by_label, get_container_by_label, create_container
# from ..wallet import encrypt_message, decrypt_message, addresses, import_key

# from .. import wallet


# from flask import Flask, request, jsonify
# from zcash_light_wallet import ZcashLightWallet  # Replace with the actual import statement for your wrapper

# app = Flask(__name__)
# wallet = ZcashLightWallet()  # Replace with the initialization of your wallet instance


@api.route('/rpc', methods=["POST"])
def rpc():
    data = request.get_json()
    account = data.get("account", "")
    method = data.get("method", "")
    params = data.get("params", "")






@api.route('/ping', methods=["GET"])
def ping():
    container_id = create_container()
    container_name = f"zec-rpc-{container_id}"
    container = get_container_by_label("name", container_name)
    if (container is None):
        return jsonify({'error': 'Not found'})

    rest_url = get_container_uri(container)
    wait_for_container(rest_url)

    response = requests.post(rest_url, json=request_rpc("ping"))
    res = response.json()
    
    return jsonify({**res, 'container': container_name})

@api.route('/wallets', methods=['GET'])
def get_accounts():
    containers = get_containers_by_label("type", "zec-rpc-server")
    return jsonify({'wallets': containers})

@api.route('/rpc/<wallet_id>', methods=['POST'])
def rpc_wallet(wallet_id):
    data = request_.get_json()
    container_name = f"zec-rpc-{wallet_id}"
    container = get_container_by_label("name", container_name)
    if (container is None):
        return jsonify({'error': 'Account not found'})

    rest_url = get_container_uri(container)
    wait_for_container(rest_url)

    response = requests.post(rest_url, json=data)
    res = response.json()

    return jsonify({**res})

@api.route('/wallets', methods=['POST'])
def create_account():
    data = request.get_json()
    address = data.get('address', None)
    ufvk = data.get('ufvk', None)

    if address is None or ufvk is None:
        return jsonify({'error': 'Name is required'}), 400

    container_id = create_container()
    container_name = f"zec-rpc-{container_id}"
    container = get_container_by_label("name", container_name)
    if (container is None):
        return jsonify({'error': 'Not found'})

    rest_url = get_container_uri(container)
    wait_for_container(rest_url)

    response = requests.post(rest_url, json=request_rpc("init", {'ufvk': ufvk}))
    res = response.json()
    
    return jsonify({**res, 'wallet_id': container_id})



    # response = requests.post("http://localhost:5000/", json=request_rpc("ping"))

    # parsed = parse(response.json())

    # return jsonify({'accounts': accounts})

# @api.route('/addresses', methods=["GET"])
# def get_addresses():
#     try:
#         res = wallet.addresses()
#         if "ua_addresses" in res and "z_addresses" in res and "t_addresses" in res:
#             return jsonify(res)
#         else:
#             return jsonify({"error": "Unable to retrieve addresses"})
#     except Exception as e:
#         return jsonify({"error": str(e)})


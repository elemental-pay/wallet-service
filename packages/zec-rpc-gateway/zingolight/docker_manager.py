import docker
import socket
import uuid
import time
import requests
from jsonrpcclient import request as request_rpc

# Create a Docker client
client = docker.from_env()
# client = docker.DockerClient(base_url='unix://var/run/docker.sock')


def stop_self():
    client = docker.from_env()
    container_id = client.containers.get(socket.gethostname()).id
    client.containers.get(container_id).stop()

def wait_for_container(container_url, max_retries=30, retry_interval=1):
    retries = 0

    while retries < max_retries:
        try:
            # Attempt to make a request to the container
            response = requests.post(container_url, json=request_rpc("ping"))
            response.raise_for_status()
            print("Container is up and running!")
            return
        except requests.exceptions.RequestException as e:
            print(f"Retrying ({retries + 1}/{max_retries}): {e}")
            retries += 1
            time.sleep(retry_interval)

    raise Exception("Max retries exceeded. Could not connect to the container.")

def get_container_uri(container):
    container_info = container.attrs
    container_name = container_info['Name'].lstrip('/')

    # Step 3: Perform a REST request on the container by hostname/container name
    container_hostname = container_info['Config']['Hostname']
    container_ip = container_info['NetworkSettings']['IPAddress']

    rest_url = f'http://{container_hostname}:3000'
    return rest_url

def get_containers_by_label(label_key, label_value):
    # Use filters to get containers by label
    filters = {
        "label": [f"{label_key}={label_value}"]
    }

    containers = client.containers.list(filters=filters)
    return containers

def get_container_by_label(label_key, label_value):
    containers = get_containers_by_label(label_key, label_value)
    container = None
    if containers and len(containers) > 0:
        container = containers[0]
    return container



def create_container(labels = {}):
    container_id = str(uuid.uuid4())[:8]
    container_labels = {**labels, "type": "zeclight-rpc", "id": container_id, "name": f"zec-rpc-{container_id}"}

    container = client.containers.run(
        image="1337bytes/zeclight-rpc",
        # command=command,
        detach=True,
        name=f"zec-rpc-{container_id}",
        hostname=f"zec-rpc-{container_id}",
        network="elemental_net",
        labels=container_labels,
        auto_remove=True
    )
    
    return container_id

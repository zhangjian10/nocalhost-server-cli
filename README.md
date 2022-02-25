<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Nocalhost server cli

This action handles [nocalhost](https://nocalhost.dev/zh-CN/docs/introduction) server side related operations

Now supports devspace vcluster create and delete

# Usage

vcluster create

```yaml
- uses: zhangjian10/nocalhost-server-cli@v0.0.6
  with:
    host: ${{ secrets.NOCALHOST_VCLUSTER_HOST_FOR_TEST }}
    email: ${{ secrets.NOCALHOST_VCLUSTER_EMAIL_FOR_TEST }}
    password: ${{ secrets.NOCALHOST_VCLUSTER_PASSWORD_FOR_TEST }}
    action: devSpace.create
    # savePath: kubeconfig save directory, default is ~/.kube/config
    # clusterName: Default is empty then take id as 1 cluster
    parameters: {'savePath': '~/.kube/config2'}
```

vcluster delete

```yaml
- uses: zhangjian10/nocalhost-server-cli@v0.0.6
  with:
    host: ${{ secrets.NOCALHOST_VCLUSTER_HOST_FOR_TEST }}
    email: ${{ secrets.NOCALHOST_VCLUSTER_EMAIL_FOR_TEST }}
    password: ${{ secrets.NOCALHOST_VCLUSTER_PASSWORD_FOR_TEST }}
    action: devSpace.remove
    # The deleted cluster id can be used with the cluster id created above
    parameters: 1
```

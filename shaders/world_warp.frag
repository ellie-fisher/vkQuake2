#version 450
#extension GL_ARB_separate_shader_objects : enable

// Underwater screen warp effect similar to what software renderer provides

layout(push_constant) uniform PushConstant
{
	float time;
	float scale;
	float scrWidth;
	float scrHeight;
} pc;

layout(set = 0, binding = 0) uniform sampler2D sTexture;
layout(location = 0) out vec4 fragmentColor;

#define PI 3.1415

vec4 blur(sampler2D tex, vec2 uv, vec2 texelSize, int radius)
{
    vec4 color = vec4(0.0);

    for (int x = -radius; x <= radius; x++)
    {
        for (int y = -radius; y <= radius; y++)
        {
            color += texture(tex, uv + vec2(x, y) * texelSize);
        }
    }

    return color / float((radius * 2 + 1) * (radius * 2 + 1));
}

void main()
{
	vec2 uv = vec2(gl_FragCoord.x / pc.scrWidth, gl_FragCoord.y / pc.scrHeight);

	if (pc.time > 0)
	{
		fragmentColor = blur(sTexture, uv, 1.0f / vec2(pc.scrWidth, pc.scrHeight), 16);
	}
	else
	{
		fragmentColor = texture(sTexture, uv);
	}
}
